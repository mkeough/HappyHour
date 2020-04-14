using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HappyHour.Models;
using HappyHour.Viewmodels;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace HappyHour.Controllers
{
  [Route("auth")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly DatabaseContext _context;

    readonly private string JWT_KEY;
    public AuthController(DatabaseContext context, IConfiguration config)
    {
      JWT_KEY = config["JWT_Key"];
      _context = context;
    }
    private string CreateJWT(User user)
    {
      var expirationTime = DateTime.UtcNow.AddHours(10);

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim("id", user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim("name", user.FullName)
      }),
        Expires = expirationTime,
        SigningCredentials = new SigningCredentials(
               new SymmetricSecurityKey(Encoding.ASCII.GetBytes(JWT_KEY)),
              SecurityAlgorithms.HmacSha256Signature
          )
      };
      var tokenHandler = new JwtSecurityTokenHandler();
      var token = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));


      return token;
    }

    [HttpPost("signup")]

    public async Task<ActionResult> SignUpNewUser(NewUser newUser)
    {
      //vaildation 
      //does the user exist
      var exists = _context.Users.Any(a => a.Email.ToLower() == newUser.Email.ToLower());
      if (exists)
      {
        return BadRequest("Email already being used");
      }
      // creating the user
      var user = new User
      {
        Email = newUser.Email,
        FullName = newUser.FullName
      };
      //hash the password
      var hashed = new PasswordHasher<User>().HashPassword(user, newUser.Password);
      user.HashedPassword = hashed;
      _context.Users.Add(user);
      await _context.SaveChangesAsync();
      //generate the jwt

      //   user.HashedPassword = null; [JsonIgnore] in user model does this
      return Ok(new { token = CreateJWT(user), user = user });
    }
    [HttpPost("login")]
    public async Task<ActionResult> LoginUser(UserLogin loginInfo)
    {
      //check if user exists
      var user = await _context.Users.FirstOrDefaultAsync(f => f.Email.ToLower() == loginInfo.Email.ToLower());
      if (user == null)
      {
        return BadRequest("user/password combonation is invalid");
      }
      //validate the users password
      var results = new PasswordHasher<User>().VerifyHashedPassword(user, user.HashedPassword, loginInfo.Password);
      if (results == PasswordVerificationResult.Success)
      {
        //create jwt
        // user.HashedPassword = null; [JsonIgnore] in user model does this
        return Ok(new { token = CreateJWT(user), user = user });
      }
      else
      {
        return BadRequest("user/password combonation is invalid");
      }

    }
  }
}