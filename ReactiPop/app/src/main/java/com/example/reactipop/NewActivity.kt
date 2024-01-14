package com.android.example.cameraxapp

import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.reactipop.R
import java.io.IOException
import java.net.Socket

class NewActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_new)

        val imageUri = intent.getStringExtra("image_uri")
        val startTime = intent.getStringExtra("start_time")
        val stopTime = intent.getStringExtra("stop_time")
        val imageView = findViewById<ImageView>(R.id.imageView)
        imageView.setImageURI(Uri.parse(imageUri))

        // Bouton pour enregitrer la photo
        val saveButton = findViewById<Button>(R.id.save_button)
        saveButton.setOnClickListener {
            sendToServer(Uri.parse(imageUri), startTime.toString(), stopTime.toString())
            Toast.makeText(this, "Photo enregistrée et envoyée au serveur", Toast.LENGTH_SHORT)
                .show()
            finish()
        }

        // Bouton pour ne pas enregistrer la photo
        val dontSaveButton = findViewById<Button>(R.id.dont_save_button)
        dontSaveButton.setOnClickListener {
            contentResolver.delete(Uri.parse(imageUri), null, null)
            Toast.makeText(this, "Photo non enregistrée", Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    private fun sendToServer(imageUri: Uri, startTime: String, stopTime: String) {
        val serverName = "10.192.18.249"
        val serverPort = 8000
        val imageData = getImageBytes(imageUri)

        if (imageData == null) {
            Log.e("ERR", "Impossible de lire l'image")
            return
        }

        Thread {
            try {
                val socket = Socket(serverName, serverPort)
                val outputStream = socket.getOutputStream()

                val startTimeBytes = startTime.toByteArray(Charsets.UTF_8)
                outputStream.write(startTimeBytes.size)
                outputStream.write(startTimeBytes)
                Log.e("bouboule", startTimeBytes.toString())

                val stopTimeBytes = stopTime.toByteArray(Charsets.UTF_8)
                outputStream.write(stopTimeBytes.size)
                outputStream.write(stopTimeBytes)
                Log.d("BOOOOBOOOO", stopTimeBytes.toString())

                outputStream.write(imageData)
                Log.e("Image", imageData.toString())

                outputStream.flush()
                socket.close()
            } catch (e: IOException) {
                Log.e("ERR sendToConnect", e.message.toString())
            }
        }.start()
    }


    private fun getImageBytes(imageUri: Uri): ByteArray? {
        return try {
            contentResolver.openInputStream(imageUri)?.use { inputStream ->
                inputStream.readBytes()
            }
        } catch (e: IOException) {
            Log.e("ERR", "Erreur lors de la lecture de l'image", e)
            null
        }
    }
}
