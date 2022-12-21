import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordRecoveryComponent } from './password-tpin-recovery/password-recovery.component';
import { UserIDRecoveryComponent } from './userid-recovery/userid-recovery.component';
import { SelfRegistrationComponent } from './self-registration/self-registration.component';
import { SignupInstructionComponent } from './signup-instruction/signup-instruction.component';

export const components = [PasswordRecoveryComponent, UserIDRecoveryComponent, SignupInstructionComponent];

const routes: Routes = [ 
    {
        path: 'tpinrecovery/:key', component: PasswordRecoveryComponent
    }, 
    {
        path: 'passwordrecovery/:key', component: PasswordRecoveryComponent
    },   
    {
        path: 'selfregistration', component: SelfRegistrationComponent
    },
    {
        path: 'useridrecovery', component: UserIDRecoveryComponent
    },
    {
        path: 'instruction', component: SignupInstructionComponent
    },     
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnonymousUserRoutingModule { }
