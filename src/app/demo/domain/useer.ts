import { Role } from "./Role";

export class Useer {
    username?: string;
    password?: string;
    jwtToken: string = '';
    refreshToken: string = '';
    //roles: Role []=[];
   
   
    constructor(username: string, jwtToken: string){
        this.jwtToken = jwtToken;
        this.username = username;
        this.password = "~$ecret~";
        //this.roles = roles;
     
       
    }
}
