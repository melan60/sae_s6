import jssc.SerialPortException;
import org.bson.types.ObjectId;

import java.io.*;
import java.net.*;
import java.util.Arrays;
import java.util.List;

class ThreadServer extends Thread {

    BufferedReader br;
    PrintStream ps;
    Socket sock;
    DataExchanger exchanger;
    ArduinoConfig arduinoConfig;
    int idThread;
    User currentUser;
    int lastExpNumero;

    public ThreadServer(int idThread, Socket sock, DataExchanger data) {
        this.sock = sock;
        this.idThread = idThread;
        this.exchanger = data;
        this.arduinoConfig = new ArduinoConfig();
        arduinoConfig.init();
    }

    /**
     * Lance le thread courant
     */
    public void run() {
        try {
            br = new BufferedReader(new InputStreamReader(sock.getInputStream()));
            ps = new PrintStream(sock.getOutputStream());
        } catch (IOException e) {
            System.err.println("Thread " + idThread + ": cannot create streams. Aborting.");
            return;
        }
        try {
            String clientType = br.readLine();
            lastExpNumero = exchanger.getMongoDriver().getLastExperience()-1;
            if (clientType.equals("analyse")) {
                analyseLoop();
            } else {
				requestLoop();
//                devLoop();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        System.out.println("end of thread " + idThread);
    }

    /**
     * Boucle du serveur d'analyse
     */
    public void analyseLoop() {
        try {
            String message = br.readLine();
            String[] response = message.split(" ");

            int execTime = Integer.parseInt(response[0]);
            int direction = Integer.parseInt(response[1]);
            System.out.println("Temps d'exécution : " + execTime + " " + ", direction : " + (direction == 0 ? "Identique" : "Différente"));

            System.out.println("Récupération de l'email");
            String mail = br.readLine();
            this.currentUser = exchanger.getMongoDriver().getUser(mail);
//            String responseBDD = exchanger.getHttpDriver().addResults(String.valueOf(lastExpNumero+1), 0, execTime, direction, currentUser);
            String responseBDD = exchanger.getMongoDriver().addResults(String.valueOf(lastExpNumero+1), 0, execTime, direction, currentUser);
            ps.println(responseBDD);
            System.out.println(responseBDD);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Boucle utilisée lors de la partie développement
     */
    public void devLoop() {
        System.out.println("ENTERING DEV LOOP");
        String req;
        int numExp;
        this.currentUser = exchanger.getMongoDriver().getUser("patelaiden@gmail.com");
        System.out.println(currentUser);
        try {
            while (true) {
                req = br.readLine();
                if ((req == null) || (req.isEmpty())) {
                    break;
                }
                try {
                    numExp = Integer.parseInt(req);
                } catch (NumberFormatException e) {
                    ps.print("ERR experience numero is not an int");
                    continue;
                }
                if (numExp < 0 || numExp > lastExpNumero) {
                    ps.println("ERR experience numero doesn't exist");
                    continue;
                }
                launchExperience(req);
            }
            System.out.println("end of request loop");
        } catch (IOException e) {
            System.out.println("problem with receiving request: " + e.getMessage());
        }
    }

    /**
     * Boucle du serveur
     */
    public void requestLoop() {
        boolean stop = false;
        String req = "";
        String[] reqParts;
        int numExp = -1;

        // Utilisé pour connaître le nombre d'expériences dans la base de données
        lastExpNumero = exchanger.getMongoDriver().getLastExperience()-1;

        try {
            // Boucle de création de l'utilisateur
            while (!stop) {
                System.out.println("Création de l'utilisateur");
                req = br.readLine();
                if (req == null || req.isEmpty()) {
                    ps.println("ERR no arguments received from client");
                    break;
                }
                reqParts = req.split(" ");
                stop = requestAddUser(reqParts);
            }

            // Boucle de lancement des expériences
            while (true) {
                // Récupération du numéro d'expérience saisi par l'utilisateur
                req = br.readLine();
                if ((req == null) || (req.isEmpty())) {
                    break;
                }

                // Conversion du numéro
                try {
                    numExp = Integer.parseInt(req);
                } catch (NumberFormatException e) {
                    ps.print("ERR experience numero is not an int");
                    continue;
                }

                // Vérification de la validité du numéro
                if (numExp < 0 || numExp > lastExpNumero) {
                    ps.println("ERR experience numero doesn't exist");
                    continue;
                }

                // Lancement de l'expérience correspondante
                launchExperience(req);
            }
            System.out.println("end of request loop");
        } catch (IOException e) {
            System.out.println("problem with receiving request: " + e.getMessage());
        }
    }

    /**
     * Lance l'expérience avec le numéro donné
     * @param numExp numéro de l'expérience
     */
    public void launchExperience(String numExp) {
        String arduinoResponse = "";
        String[] results;
        try {
            // Envoi du numéro de l'expérience à lancer au Arduino
            this.arduinoConfig.getSerialPort().writeString(numExp);

            // Boucle de récupération des résultats envoyés par l'Arduino
            while (true) {
                if (this.arduinoConfig.getSerialPort().getInputBufferBytesCount() > 0) {
                    arduinoResponse = this.arduinoConfig.getSerialPort().readString();
                    results = arduinoResponse.split("\n");
//					System.out.println("Exp n°" + numExp + ", React : " + results[0] + ", Exec : " + results[1] + ", Errors : " + results[2]);
                    break;
                }
            }
        } catch (SerialPortException e) {
            System.out.println("Error writing to the serial port");
            ps.println("ERR no result returned from arduino");

            System.out.println("ERR : " + e);
            ps.println("ERR : " + e);
            return;
        }
        for(int i = 0; i < results.length; i++) {
            System.out.println(results[i]);
        }
        // Vérification des valeurs retournées par l'Arduino
        float[] res = checkValuesAddResults(results[0], results[1], results[2]);
        if (res[0] == 1) {
            ps.println("ERR invalid parameters");
            return;
        }
//		String response = exchanger.getHttpDriver().addResults(numExp, res[1], res[2], (int) res[3], currentUser);
        String response = exchanger.getMongoDriver().addResults(numExp, res[1], res[2], (int) res[3], currentUser);
        ps.println(response);
        System.out.println(response);
    }

    /**
     * Vérifie les valeurs des paramètres et créé un utilisateur
     * @param params paramètres de la requête
     * @return true si l'utilisateur est créé, false sinon
     * @throws IOException si la requête n'est pas correcte
     */
    public boolean requestAddUser(String[] params) throws IOException {
        if (params.length != 8) {
            ps.println("ERR invalid number of parameters");
            return false;
        }

        // Vérification de la validité des paramètres
        String[] resCheck = checkValuesAddUser(params[5], params[6], params[7]);
        if (resCheck[0].startsWith("ERR")) {
            System.out.println("Error checkValuesAddUser: " + resCheck[0]);
            ps.println(resCheck[0]);
            return false;
        }

        User user = new User(params[1], params[2], params[3], params[4], resCheck[1], resCheck[2], resCheck[3]);
        // Ajout de l'utilisateur dans la base de données
		String response = exchanger.getMongoDriver().addUser(user);
//        String response = exchanger.getHttpDriver().addUser(user);
        System.out.println(response);
        String[] res = response.split(" ");
        if (response.startsWith("ERR")) {
            System.out.println("error with request create user: " + response);
            ps.println(response);
            return false;
        }

        // Transformation de l'ID donné en string en ObjectID
        ObjectId _id = new ObjectId(res[2]);
        user.setId(_id);
        this.currentUser = user;
        /** Envoi de la réponse à {@link ThreadServer#requestLoop()} */
        ps.println(res[0] + " " + res[1] + " " + lastExpNumero);
        return true;
    }

    /**
     * Vérifie les valeurs des paramètres pour la requête {@link HttpDataDriver#addResults(String, float, float, int, User)}
     * @param react temps de réaction
     * @param exec temps d'exécution
     * @param errors nombre d'erreurs
     * @return un tableau avec le résultat de la vérification
     */
    public float[] checkValuesAddResults(String react, String exec, String errors) {
        float[] res = new float[4];
        // Code de vérification d'erreurs, 0 = success
        res[0] = 0;
        // Vérifie le type des valeurs
        try {
            res[1] = Float.parseFloat(react);
            res[2] = Float.parseFloat(exec);
            res[3] = Float.parseFloat(errors);
        } catch (NumberFormatException e) {
            // Si une exception est déclenchée, le code d'erreur est défini à 1
            res[0] = 1;
            return res;
        }
        // Si le nombre d'erreurs est incorrect, le code d'erreur est défini à 1
        if (res[3] < 0 || res[3] > 5)
            res[0] = 1;
        return res;
    }

    /**
     * Vérifie les valeurs des paramètres pour la requête {@link HttpDataDriver#addUser(User)}
     * @param age age de l'utilisateur
     * @param gender sexe de l'utilisateur
     * @param typeUser type de l'utilisateur
     * @return tableau avec le résultat de la vérification
     */
    public String[] checkValuesAddUser(String age, String gender, String typeUser) {
        String[] returnTab = new String[4];
        // Code de vérification d'erreur, initialisé à OK
        returnTab[0] = "OK";

        // Vérifie si la valeur accordée à l'âge est correcte
        String response = isValueCorrect(age, Arrays.asList("Enfant", "Adolescent", "Adulte", "Personne Agée"), "ERR invalid age");
        if (response.startsWith("ERR")) {
            returnTab[0] = response;
            return returnTab;
        } else {
            returnTab[1] = response;
        }

        // Vérifie si la valeur accordée au sexe est correcte
        response = isValueCorrect(gender, Arrays.asList("Masculin", "Féminin"), "ERR gender doesn't exist");
        if (response.startsWith("ERR")) {
            returnTab[0] = response;
            return returnTab;
        } else {
            returnTab[2] = response;
        }

        // Vérifie si la valeur accordée au type est correcte
        response = isValueCorrect(typeUser, Arrays.asList("admin", "cobaye"), "ERR typeUser doesn't exist");
        if (response.startsWith("ERR")) {
            returnTab[0] = response;
            return returnTab;
        } else {
            returnTab[3] = response;
        }

        return returnTab;
    }

    /**
     * Vérifie que la valeur est correcte parmi la liste des valeurs possibles
     * @param value valeur à vérifier
     * @param choices liste des valeurs possibles
     * @param error erreur à retourner si la valeur n'est pas correcte
     * @return la valeur si elle est correcte, l'erreur sinon
     */
    public String isValueCorrect(String value, List<String> choices, String error) {
        int valueInt;
        try {
            valueInt = Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return "ERR " + e.toString();
        }

        if (valueInt > 0 && valueInt < choices.size() + 1) {
            return choices.get(valueInt - 1);
        }
        return error;
    }
}