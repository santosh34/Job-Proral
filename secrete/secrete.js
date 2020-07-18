module.exports = {
    auth: {
        user: 's7624589@gmail.com',
        pass: 'nodejs29386'
    },
    google:{
        clientID:'931639576094-7pci5cbabpnocm81sstsaeu12f38dkl7.apps.googleusercontent.com',
        clientSecret:'86JhtgXsMSnOw_JgWwHqhDtY',
        profileFields:['email','displayName','profile'],
        callbackURL:'http://localhost:3000/auth/google/callback',
        passReqToCallback:true
    }
}
    