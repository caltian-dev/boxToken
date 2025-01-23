First Step - Get Authorize code
https://account.box.com/api/oauth2/authorize?response_type=code&client_id=o7xpgssqmi6ztyurh7icr8orqq6asrbt&redirect_uri=http://localhost:3000

A redirect_uri have must add to box app configuration.

Second Step - Get Refresh token
https://api.box.com/oauth2/token
Content-Type: x-www-form-urlencoded
code: [Authorize code]
grant_type: authorization_code
client_id: [Your Client ID]
client_secret: [Your Client Secret]
