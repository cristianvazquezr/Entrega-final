import mongoose from "mongoose";
import Assert from 'assert'
import userMananger from "../../src/dao/userMananger.js";

mongoose.connect("mongodb+srv://vazquezcristianr:Cristian123@clustercristian.ggp7vhd.mongodb.net/ecommerce-test?retryWrites=true&w=majority")
const assert=Assert.strict;

describe('testing Session DAO', ()=>{

    before(function(){
        this.sessionDao=new userMananger()
    })

    beforeEach(async function(){
        mongoose.connection.collections.users.drop()
        this.timeout(50000)
    })

    it('el get debe devolver un arreglo', async function(){
        const result= await this.sessionDao.getUsers({});
        console.log(result);
        assert.strictEqual(typeof result, 'object')

    }).timeout(10000)

    it('el AddUser debe agregar un usuario ', async function(){

        const result= await this.sessionDao.addUser('first_name','last_name','email3',100,'123456','admin');
        console.log(result);
        assert.strictEqual(result, true)

    }).timeout(10000)

    it('el getuserById debe buscar un usuario por ID ', async function(){

        const addUser= await this.sessionDao.addUser('first_name','last_name','email1',100,'3456','admin')
        const getUser=await this.sessionDao.getUsers({})
        const idUser=await getUser.payLoad[0]._id
        const result= await this.sessionDao.getUserById(idUser)
        assert.strictEqual(typeof result, 'object')

    }).timeout(10000)


})