export interface IChangePassword {
    UserName?: string;
    OldPassword?: string;
    NewPassword?: string;
    ConfirmPassword?: string;    
}

export interface IChangePasswordResponse {
    Status:  string;
    Message: string;
    Result:  null;
}