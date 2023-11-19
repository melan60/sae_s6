import com.google.gson.Gson;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.net.*;
import java.net.http.*;
import java.net.http.HttpResponse.*;
import java.io.*;
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
        int error = answer.getInteger("error");
        if (error != 0) {
            return answer.getString("data");
        }
        return null;
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

    public synchronized String addUser(String name, String firstname, String password, String email, int age, String gender, String typeUser){
        if(!(gender.equals("Masculin") || gender.equals("Féminin") || gender.equals("Autre"))){
            return "ERR gender doesn't exist";
        }

        if(!(typeUser.equals("cobaye") || typeUser.equals("admin"))){
            return "ERR typeUser doesn't exist";
        }

        User user = new User(name, firstname, password, email, age, gender, typeUser);

        // transform a Java class in a JSON
        Gson gson = new Gson();
        String jsonRequest = gson.toJson(user);
        System.out.println(jsonRequest);

        Document doc = postRequest("/user/add", jsonRequest);
        if (doc == null) {
            return "ERR cannot join the API";
        }

        // if error
        String err = checkError(doc);
        if (err != null) return err;
        // if not, get desired field in data
        Document data = (Document)doc.get("data");
        name = data.getString("name");
        return "OK" + name;
    }

    public String addResults(String idExp, int reactTime, int execTime, User user){
        return "";
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
