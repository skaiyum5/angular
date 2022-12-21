export interface IRecentActivity {
    count?: string;    
}

export interface IRecentActivityResponse {
    id:            string;
    userName:      string;
    activityAt:    Date;
    activityNM:    string,
    activityType:  string;
    comment:       string;
    requestedFrom: string;
    oldData:       null;
    newData:       null;
    userType:      string;
    amount:        string;
    ipImei:        string;
}

// Top Activity Response
export interface ITopActivityResponse
{
      title?: string;
      activityID?: string;
      transferType?: string;
      url?: string;
      shTitle?: string;
}

// Add New Activity Response
export interface INewActivity
{
    activityMsg?: string;
    IpImei?: any;
    channel?: string;
    activityShNM?: string;
    type?: number;
}

export interface INewActivityResponse
{
    Status: string;
    Message: string;
    Result: string;
}



