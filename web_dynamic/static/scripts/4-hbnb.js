$(document).ready(function () {
  let amenities = {};
  $(document).on('change', "input[type='checkbox']", function () {
    if (this.checked) {
      amenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete amenities[$(this).data('id')];
    }
    let lst = Object.values(amenities);
    if (lst.length > 0) {
      $('div.amenities > h4').text(Object.values(amenities).join(', '));
    } else {
      $('div.amenities > h4').html('&nbsp;');
    }
  });
  $.get('http://localhost:5001/api/v1/status/', function(data, status) {
    console.log(data);
    if (status === 'success') {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    } else {
      $('#api_status').removeClass('available');
    }
  });
  $.post({
    url: `${HOST}/api/v1/places_search`,
    data: JSON.stringify({}), // Empty data to fetch all places
    headers: {
      "Content-Type": "application/json",
    },
    dataType: "json",
    success: (data) => {
      const articles = data.map((place) => {
        const {
          name,
          price_by_night,
          max_guest,
          number_rooms,
          number_bathrooms,
          description,
        } = place;
        const pluralize = (count, singular, plural) =>
          `${count} ${count === 1 ? singular : plural}`;
        return `
          <article>
            <div class="title_box">
              <h2>${name}</h2>
              <div class="price_by_night">$${price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${pluralize(
                max_guest,
                "Guest",
                "Guests"
              )}</div>
              <div class="number_rooms">${pluralize(
                number_rooms,
                "Bedroom",
                "Bedrooms"
              )}</div>
              <div class="number_bathrooms">${pluralize(
                number_bathrooms,
                "Bathroom",
                "Bathrooms"
              )}</div>
            </div>
            <div class="description">
              ${description}
            </div>
          </article>
        `;
      });
      $("section.places").append(articles.join(""));
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Error fetching places:", textStatus, errorThrown);
    },
  });
  $(".filters button").bind("click", searchPlace);
	searchPlace();
});
