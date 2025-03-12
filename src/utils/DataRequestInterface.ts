interface DataRequester {
    getData(type: string, params?: Record<string, string>): Promise<any>;
}

export default DataRequester;
