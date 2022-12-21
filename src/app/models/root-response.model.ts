export class RootResponse<T> {
    Status: string;
    Message: string;
    Result: T;
}

export interface ISingleResponse
{
    Status?: string;
    Message?: string;
    Result?: string;
}