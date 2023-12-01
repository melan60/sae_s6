import com.google.gson.Gson;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.net.*;
import java.net.http.*;
import java.net.http.HttpResponse.*;
import java.io.*;

public class HttpDataDriver implements DataDriver {

    private final HttpClient client;
    private final String apiURL;

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
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiURL+route+req))
                .header("Content-Type", "application/json")
                .build();
        return getResponse(request);
    }

    private Document postRequest(String route, String payload) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiURL+route))
                .header("Content-Type", "application/json")
                .method("POST",HttpRequest.BodyPublishers.ofString(payload))
                .build();
        return getResponse(request);
    }

    private Document getResponse(HttpRequest request){
        Document doc;
        try {
            HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
//            System.out.println(response.body());
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

        Document doc = postRequest("/user/add", jsonRequest);
        if (doc == null) return "ERR cannot join the API";

        String err = checkError(doc);
        if (err != null) return "ERR wrong response from API";
        // if there is no error, get desired field in data
        Document data = (Document)doc.get("data");
        String name = data.getString("name");
        String _id = data.getString("_id");
        return "OK " + name + " " + _id;
    }

    public synchronized int getLastExperience(){
        Document doc = getRequest("/experience/last", "");
        Document data = (Document)doc.get("data");
        int numero = data.getInteger("numero");
        return numero;
    }

    public synchronized String addResults(String idExp, float reactTime, float execTime, int nbErrors, User user){
        // used to get the _id of the experience
        Document doc = getRequest("/experience", "?numero="+idExp);
        Document data = (Document)doc.get("data");
        String id = data.getString("_id");
        ObjectId _id = new ObjectId(id);

        // initialize a Java class depending on the arguments required for the request
        ResultsModel resultsModel = new ResultsModel();
        resultsModel.setUser(user);
        Result result = new Result(_id, reactTime, execTime, nbErrors);
        resultsModel.setResult(result);

        // transform a Java class in a JSON
        Gson gson = new Gson();
        String jsonRequest = gson.toJson(resultsModel);

        // the ObjectId experience for Result is currently in the wrong format
        Document requestDoc = Document.parse(jsonRequest);
        Document resultDoc = (Document)requestDoc.get("result");
        // Replace the experience in the wrong format with the variable in the String id
        resultDoc.replace("experience", id);
        requestDoc.replace("result", resultDoc);
        jsonRequest = requestDoc.toJson();

        Document requestResponse = postRequest("/user/result/add", jsonRequest);
        if (requestResponse == null) {
            return "ERR cannot join the API";
        }

        String err = checkError(requestResponse);
        if (err != null) return "ERR wrong response from API";
        // if not, get desired field in data
        Document dataResponse = (Document)requestResponse.get("data");
//        String name = dataResponse.getString("name");
//        return "OK " + name;
        return "OK";
    }
}
