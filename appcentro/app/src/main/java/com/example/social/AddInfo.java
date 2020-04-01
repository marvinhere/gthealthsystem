package com.example.social;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.UserProfileChangeRequest;

public class AddInfo extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_info);
        final FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser() ;
    }

 private void addUserNameToUser(FirebaseUser user, String name){
     UserProfileChangeRequest profileUpdates = new UserProfileChangeRequest.Builder()
     .setDisplayName(name).build();

     user.updateProfile(profileUpdates).addOnCompleteListener(new OnCompleteListener<Void>() {
         @Override
         public void onComplete(@NonNull Task<Void> task) {
             Toast toast = Toast.makeText(AddInfo.this, "Perfil Actualizado",Toast.LENGTH_SHORT);
             toast.show();
         }
     });

 }
}
