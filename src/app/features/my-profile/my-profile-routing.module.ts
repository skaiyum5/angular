import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactDetailResolverService } from 'src/app/services/contact-detail-resolver.service';
import { DetailProfileComponent } from './detail-profile/detail-profile.component';
import { BasicProfileComponent } from './basic-profile/basic-profile.component';

export const components = [BasicProfileComponent, DetailProfileComponent];

const routes: Routes = [
    {
        path: '', component: BasicProfileComponent
    },
    {
        path: 'detailprofile', component: DetailProfileComponent,
        resolve: { contactInfo: ContactDetailResolverService },
        //data: {addressType: '1'}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyProfileRoutingModule { }
