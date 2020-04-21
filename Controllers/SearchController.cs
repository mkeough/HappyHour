using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HappyHour.Models;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text.Json;

namespace HappyHour.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SearchController : ControllerBase
  {
    private readonly DatabaseContext _context;

    private readonly string MAPBOX_TOKEN;

    public SearchController(DatabaseContext context, IConfiguration config)
    {
      _context = context;
      this.MAPBOX_TOKEN = config["MAPBOX_TOKEN"];
    }

    [HttpGet("city/{searchCity}")]

    public async Task<ActionResult> SearchCities(string searchCity)
    {
      var client = new HttpClient();
      var resp = await client.GetAsync($"https://api.mapbox.com/geocoding/v5/mapbox.places/{searchCity}.json?access_token=pk.eyJ1Ijoia2VvdWdobSIsImEiOiJjazhwNDQ4ZTAwMHdjM21wMWpmcmx6Znl5In0.8teYNnKkLBfla2ZsBUMEFQ");

      var json = await JsonDocument.ParseAsync(await resp.Content.ReadAsStreamAsync());
      var root = json.RootElement;
      var feature = root.GetProperty("features").EnumerateArray().First();
      var center = feature.GetProperty("center").EnumerateArray();
      var lng = center.First();
      var lat = center.Skip(1).First();

      return Ok(new { lat = lat, lng = lng });


    }
  }
}
