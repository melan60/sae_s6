import com.google.gson.Gson;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.net.*;
import java.net.http.*;
import java.net.http.HttpResponse.*;
import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;


public class HttpDataDriver implements DataDriver {

    private HttpClient client;
    private String apiURL;

    public HttpDataDriver(String apiURL) {
        this.apiURL = apiURL;
        client = HttpClient.newHttpClient();
    }

    public boolean init() {
        return true;
    }

    private String checkError(Document answer) {
        int error = answer.getInteger("success");
        if (error == 0) {
            return "ERR";
        }
        return null;
    }

    private Document getRequest(String route, String req){
        Document doc = null;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiURL+route+req))
                .header("Content-Type", "application/json")
                .build();
        try {
            HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
            System.out.println(response.body());
            // parse received JSON
            doc = Document.parse(response.body());
        }
        catch(InterruptedException e) {
            return null;
        }
        catch(IOException e) {
            return null;
        }
        return doc;
    }

    private Document postRequest(String route, String payload) {
        Document doc = null;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiURL+route))
                .header("Content-Type", "application/json")
                .method("POST",HttpRequest.BodyPublishers.ofString(payload))
                .build();
        try {
            HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
            System.out.println(response.body());
            // parse received JSON
            doc = Document.parse(response.body());
        }
        catch(InterruptedException e) {
            return null;
        }
        catch(IOException e) {
            return null;
        }
        return doc;
    }

    public synchronized String addUser(User user){
        ResultsModel resultsModel = new ResultsModel();
        resultsModel.setUser(user);

        // transform a Java class in a JSON
        Gson gson = new Gson();
        String jsonRequest = gson.toJson(resultsModel);
        System.out.println(jsonRequest);

        Document doc = postRequest("/user/add", jsonRequest);
        if (doc == null) {
            return "ERR cannot join the API";
        }

        // if error
        String err = checkError(doc);
        if (err != null) return "ERR wrong response from API";
        // if not, get desired field in data
        Document data = (Document)doc.get("data");
        String name = data.getString("name");
        return "OK " + name;
    }

    public int getLastExperience(){
        Document doc = getRequest("/experience/last", "");
        Document data = (Document)doc.get("data");
        int numero = data.getInteger("numero");
        return numero;
    }

    public String addResults(String idExp, float reactTime, float execTime, int nbErrors, User user){
        Document doc = getRequest("/experience", "?numero="+idExp);
        Document data = (Document)doc.get("data");
        ObjectId id = data.getObjectId("_id");

        ResultsModel resultsModel = new ResultsModel();
        resultsModel.setUser(user);
        Result result = new Result(id, reactTime, execTime, nbErrors);
        resultsModel.setResult(result);

        // transform a Java class in a JSON
        Gson gson = new Gson();
        String jsonRequest = gson.toJson(resultsModel);
        System.out.println(jsonRequest);

        Document requestResponse = postRequest("/result/add", jsonRequest);
        if (requestResponse == null) {
            return "ERR cannot join the API";
        }

        // if error
        String err = checkError(requestResponse);
        if (err != null) return "ERR wrong response from API";
        // if not, get desired field in data
        Document dataResponse = (Document)requestResponse.get("data");
//        String name = dataResponse.getString("name");
//        return "OK " + name;
        return "OK";
    }

    public synchronized String autoRegisterModule(String uc, List<String> chipsets) {
        String payload = "{\"uc\": \""+uc+"\", \"chipsets\": [";
        String name = "";
        String shortName = "";
        String key = "";
        int i = 0;
        for(i=0;i<chipsets.size()-1;i++) {
            payload += "\""+chipsets.get(i)+"\",";
        }
        payload += "\""+chipsets.get(i)+"\"]}";

        Document doc = postRequest("/module/register", payload);
        if (doc == null) {
            return "ERR cannot join the API";
        }
        // if error
        String err = checkError(doc);
        if (err != null) return err;
        // if not, get desired field in data
        Document data = (Document)doc.get("data");
        name = data.getString("name");
        shortName = data.getString("shortName");
        key = data.getString("key");
        return "OK "+name+","+shortName+","+key;
    }

    public synchronized  String saveMeasure(String type, String date, String value, String moduleKey) {

        String payload = "{\"type\": \""+type+"\", \"date\": \""+date+"\", \"value\": \""+value+"\", \"moduleKey\": \""+moduleKey+"\"}";
        return sendMeasure(payload);
    }

    public synchronized String saveAnalysis(String type, String date, String value) {

        String payload = "{\"type\": \""+type+"\", \"date\": \""+date+"\", \"value\": \""+value+"\"}";
        return sendMeasure(payload);
    }

    private String sendMeasure(String payload) {
        Document doc = postRequest("/measure/create", payload);
        if (doc == null) {
            return "ERR cannot join the API";
        }
        String err = checkError(doc);
        if (err != null) return err;
        return "OK";
    }
}
