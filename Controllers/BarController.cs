using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HappyHour.Models;
using System.Net.Http;
using System.Text.Json;
using Microsoft.Extensions.Configuration;


namespace HappyHour.Controllers
{
  [Route("api/[controller]")]
  [ApiController]

  public class BarController : ControllerBase
  {
    private readonly DatabaseContext _context;
    private readonly string _MAPBOX_TOKEN;


    public BarController(DatabaseContext context, IConfiguration config)
    {
      _context = context;
      this._MAPBOX_TOKEN = config["mapbox-token"];

    }

    // GET: api/Bar
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Bar>>> GetBars()
    {
      return await _context.Bars.ToListAsync();
    }

    // GET: api/Bar/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Bar>> GetBar(int id)
    {
      var bar = await _context.Bars.FindAsync(id);

      if (bar == null)
      {
        return NotFound();
      }

      return bar;
    }

    // PUT: api/Bar/5
    // To protect from overposting attacks, please enable the specific properties you want to bind to, for
    // more details see https://aka.ms/RazorPagesCRUD.
    [HttpPut("{id}")]
    public async Task<IActionResult> PutBar(int id, Bar bar)
    {
      if (id != bar.Id)
      {
        return BadRequest();
      }

      _context.Entry(bar).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!BarExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return NoContent();
    }

    // POST: api/Bar
    // To protect from overposting attacks, please enable the specific properties you want to bind to, for
    // more details see https://aka.ms/RazorPagesCRUD.
    [HttpPost]
    public async Task<ActionResult<Bar>> PostBar(Bar bar)
    {
      var client = new HttpClient();
      var fullAddress = $"{bar.Address}, {bar.City}, {bar.State}, {bar.Zip}";
      var resp = await client.GetAsync($"https://api.mapbox.com/geocoding/v5/mapbox.places/{fullAddress}.json?access_token={this._MAPBOX_TOKEN}");

      var json = await JsonDocument.ParseAsync(await resp.Content.ReadAsStreamAsync());
      Console.WriteLine(json);
      Console.WriteLine(this._MAPBOX_TOKEN);
      var root = json.RootElement;
      var feature = root.GetProperty("features").EnumerateArray().First();
      var center = feature.GetProperty("center").EnumerateArray();
      var lng = center.First();
      var lat = center.Skip(1).First();

      Console.WriteLine($"{lat},{lng}");
      bar.Latitude = lat.GetDouble();
      bar.Longitude = lng.GetDouble();

      _context.Bars.Add(bar);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetBar", new { id = bar.Id }, bar);
    }

    // DELETE: api/Bar/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<Bar>> DeleteBar(int id)
    {
      var bar = await _context.Bars.FindAsync(id);
      if (bar == null)
      {
        return NotFound();
      }

      _context.Bars.Remove(bar);
      await _context.SaveChangesAsync();

      return bar;
    }

    private bool BarExists(int id)
    {
      return _context.Bars.Any(e => e.Id == id);
    }
  }
}
