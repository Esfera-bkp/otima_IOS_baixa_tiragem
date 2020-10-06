function saveUser(USER){
    var txt = JSON.stringify(USER);

    window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getFile(PATHAPP+USER_PLIST, {create: true, exclusive: false}, function (fileEntry) {
            fileEntry.createWriter(function (writer) {
                writer.onwriteend = function(evt) {
                    // writer.truncate(txt.length);   
                    console.log("user saved: "+USER.email);
                    // writer.onwriteend = function(evt) {


                        // };              
                    };
                    writer.write(txt);
                }, fail);
        }, fail);
    }, fail);

}
function removeUserFile(){
    loga('removeUserFile');
    window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {
                        fileSystem.root.getFile(PATHAPP+USER_PLIST, null, function (fileEntry) {
                            fileEntry.remove(function(){

                                
                            }, function(){console.log('erro ao remover user files.')});
                        }, fail);
                        
                        
                    }, fail);
}

function loadUser(){

     
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {
            target_directory = fileSystem.root.nativeURL; 
            fileSystem.root.getFile(PATHAPP+USER_PLIST, null, function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        
                        
                        try{
                            $user = $.parseJSON(evt.target.result);
                            USER = $user;

                            console.log("Loaded user->"+USER.email);
                            console.log("Loaded user->"+USER.senha);
                            // window.localStorage.setItem('USER', USER);
                            $('#email').val(USER.email);
                            $('#senha').val(USER.senha);
                            
                            
                        }catch(e){
                            removeUserFile();
                            console.log("cathed error load"+JSON.stringify(e));
                        }
                        

                    };
                    reader.readAsText(file);
                },fail);
            }, function(){
                console.log('agora nao tem user');
                
            });
        });
        
    
}