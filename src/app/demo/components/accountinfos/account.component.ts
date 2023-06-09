import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/domain/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserService } from '../../services/user.service';
import { User } from '../../domain/user';
import { Observable, map } from 'rxjs';
//import { Role } from '../../domain/ERole';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ERole } from '../../domain/Erole';
import { Role } from '../../domain/Role';
import { error } from 'console';
import { AuthService } from '../../services/auth.service';
import { resourceUsage } from 'process';
import { Url } from 'url';

@Component({
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    userDialog: boolean = false;

    deleteUserDialog: boolean = false;

    deleteUsersDialog: boolean = false;

    users:Array<User> = [];

    user!: User ;

    half_cast: any =  [];
    
    MODE: string = 'CREATE';
  

    roles: Role[] = [
        { id: 1, name: "ADMIN" },
        { id: 2, name: "AGENT" },
        { id: 3, name: "USER" },
        { id: 4, name: "MAGASINIER" },
        { id: 5, name: "CLIENT" }
      ];


    selectedUsers: User[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    idToDel:number=NaN;

    idToUpdate:number=NaN;

    id!: number;

    idToget:number=NaN;
    
    rowsPerPageOptions = [5, 10, 20];

    avatarUrl: string = '';
    


    constructor(private userService: UserService, private authService:AuthService, private messageService: MessageService,
        public formBuilder: FormBuilder, public router:Router) { 
            this.id = this.authService.getAuthedUserID()
            console.log(this.id)
            var role_name =this.authService.UserRole.roles[0].name;
  
        }

    ngOnInit() {   
       
        
            this.cols = [
                { field: 'name', header: 'Name' },
                { field: 'email', header: 'Email' },
                { field: 'role', header: 'Role' }
            ];

           

        this.showDialog(this.id);
        this.getAvatarByRole(this.id);
    }
    
    showDialog(id: number){
        this.idToget= id;
        this.userService.getUserById(this.idToget)
          .subscribe((data)=>{
                
              console.log(data.roles[0].name)
                // cas oui 
              this.users = [data];
              console.log(this.users)
          
      })
    }

   
   
    getAvatarByRole(id: number) {
      this.userService.getUserById(id).subscribe(
        (data: any) => {
          if (data.roles[0].name === 'ADMIN') {
            this.avatarUrl = 'assets/demo/images/avatar/admin.jpg';
          } else if (data.roles[0].name === 'CLIENT') {
            this.avatarUrl = 'assets/demo/images/avatar/Client.png';
          } else if(data.roles[0].name === 'MAGASINIER') {
            this.avatarUrl = 'assets/demo/images/avatar/magasinier.png';
          }
          else {
            this.avatarUrl = 'assets/demo/images/avatar/agent.png';
          }
        },
        (error: any) => {
          
        }
      );
    }

     
      


    openNew() {
        this.user = new User(NaN, '', '', '', []);
        this.submitted = false;
        this.MODE = 'CREATE';
        this.userDialog = true;
    }

    editUser(id:number, data: User) {
        this.user=data;
        this.userDialog = true; 
        this.idToUpdate = id;
        this.MODE = 'APPEND'      
     }
       

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    saveUser() {
        
       if (this.MODE === 'CREATE'){
        const toAdd: User = {
            'username': this.user.username,
            'email' :this.user.email ,
            'password': this.user.password,
            'roles' : this.user.roles// Set<Role> -- table mtaa role
            };
        this.userService.createUser(toAdd).subscribe( data =>{
            console.log(data);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
            this.userDialog = false;
            this.ngOnInit();   
            }, error => {
                console.log(error);
                this.messageService.add({severity: 'error',summary: 'Erreur',detail: ' Une erreure s\'est produite! ', life: 3000 });
                this.userDialog = false;
                } );
            


    } else if( this.MODE === 'APPEND') {
        const toEdit: User=  {
            'username' : this.user.username,
            'email' :this.user.email ,
            'password': this.user.password,
            'roles' : this.user.roles// Set<Role> -- table mtaa role
          }
        
        this.userService.updateUser(this.idToUpdate, toEdit).subscribe( (data) =>{
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Profile Updated', life: 3000 });
            this.userDialog = false;
            this.ngOnInit();   
          }, error => {
            console.log(error);
            this.messageService.add({severity: 'error',summary: 'Erreur',detail: ' Une erreure s\'est produite! ', life: 3000 });
            this.userDialog = false;
            } );
    }
        
    }
        

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}