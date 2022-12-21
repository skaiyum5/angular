export interface IPasswordChange {
    userName?: string,
    oldPassword?: string,
    newPassword?: string,
    confirmPassword?: string
}

export interface ITpinChange {
    userName?: string,
    oldTpin?: string,
    newTpin?: string,
    confirmTpin?: string
}

export interface IPasswordOrTpinRecovery {   
    USERNAME?: string;
    EMAIL?: string;
    BIRTH_DATE?: string;
    BRANCH_ID?: string;
    ACCOUNT_NUMBER?: string;
    OTP?: string; 
    NEW_PASSWORD_OR_TPIN?: string;
}

export interface ITPinRecovery {
    USERNAME?: string;
    EMAIL?: string;
    BIRTH_DATE?: string;
    BRANCH_ID?: string;
    ACCOUNT_NUMBER?: string;
    OTP?: string; 
    NEW_PASSWORD_OR_TPIN?: string;
}

export interface IUserIDRecovery
{
  BRANCH_ID?: string;
  ACCOUNT_NUMBER?: string;
  EMAIL?: string;
  MOBILE?: string;
  BIRTH_DATE?: string;
  OTP?: string;
}