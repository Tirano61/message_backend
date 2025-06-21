

export class User extends Document {
    //id: string; ya lo proporciona mongo 

    email: string;

    password: string;

    fullName: string;

    isActive: boolean;

    roles: string[];

}


