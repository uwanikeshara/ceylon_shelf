
export type Reader = {
    _id?: string; 
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    registerDate: string | Date;
}

export type ReaderFormData = {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    registerDate: string;
}