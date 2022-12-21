export interface IRecentActivity {
    count?: string;    
}

// export interface IRecentActivityResponse {
//     Status:  string;
//     Message: string;
//     Result:  Result[];
// }

export interface IRecentActivityResponse {
    id:            string;
    userName:      string;
    activityAt:    Date;
    activityType:  string;
    comment:       string;
    requestedFrom: string;
    oldData:       null;
    newData:       null;
    userType:      string;
    amount:        string;
}

