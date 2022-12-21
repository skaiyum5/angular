import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserActivityComponent } from './user-activity/user-activity.component';


export const components = [UserActivityComponent];

const routes: Routes = [
    {
        path: 'useractivity', component: UserActivityComponent
    },    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserActivityRoutingModule { }
