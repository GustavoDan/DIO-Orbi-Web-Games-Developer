function getAdmins(map){
    let admins = [];
    for([key, value] of map){
        if(value.toUpperCase().trim() === 'ADMIN'){
            admins.push(key);
        }
    }

    return admins;
}

let userRoles = new Map();

userRoles.set('Stephany', 'SUDO');
userRoles.set('Luiz', 'ADMIN');
userRoles.set('Elvira', 'ADMIN');
userRoles.set('Carolina', 'USER');
userRoles.set('Guilherme', 'USER');

console.log(getAdmins(userRoles));