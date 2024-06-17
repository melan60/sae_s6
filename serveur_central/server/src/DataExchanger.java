class DataExchanger {

    private final DataDriver httpDriver;
    private final DataDriver mongoDriver;

    public DataExchanger(String apiURL, String mongoURL) {
        httpDriver = new HttpDataDriver(apiURL);
        mongoDriver = new MongoDataDriver(mongoURL);
    }

    public DataDriver getHttpDriver() {
        return httpDriver;
    }

    public DataDriver getMongoDriver() {
        return mongoDriver;
    }
}
