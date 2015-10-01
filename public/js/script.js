$(document).ready(function() {
	

/*******************************  GMaps  ***********************************/
	if ($('#map').length) {
		
		var map;
		map = new GMaps({
			div: '#map',
			lat: -22.775729,
			lng: -45.1984134
		});

		map.addMarker({
			lat: -22.775729,
			lng: -45.1984134,
			title: 'Contanct',
			infoWindow: {
				content: 'Vilage Santana<br /> 12513-400, BR<br /> <br /> Email: amoraosdetalhes@outlook.com.br <br /> Web: amoraosdetalhes.com.br'
			}
		});

	}

/*******************************  carousel  ***********************************/

	$('.carousel').carousel({
		  interval: 3000
		});



/*******************************  go to top arrow ***********************************/
	$(window).scroll(function(){
		 if ($(this).scrollTop() > 100) {
			 $('.scrollup').fadeIn();
		 } else {
			 $('.scrollup').fadeOut();
		 }
	 }); 
 
	 $('.scrollup').click(function(){
		 $("html, body").animate({ scrollTop: 0 }, 600);
		 return false;
	 });



/*****************************  Forms  *********************************/
	$("#contact-form").submit(function() {
		var elem = $(this);
		var urlTarget = $(this).attr("action");
		$.ajax({
			type : "POST",
			url : urlTarget,
			dataType : "html",
			data : $(this).serialize(),
			beforeSend : function() {
				elem.prepend("<div class='loading alert'>" + "<a class='close' data-dismiss='alert'>Ã—</a>" + "Loading" + "</div>");
			},
			success : function(response) {
				elem.prepend(response);
				elem.find(".loading").hide();
				elem.find("input[type='text'],input[type='email'],textarea").val("");
			}
		})
		return false;
	});
	

	/***********************  Slider Revolution  ***************************/
	if($('.banner').length) {
		$('.banner').revolution({
			startheight:500,
			startwidth:1200,
			onHoverStop: "on",
			hideThumbs:1,
			navigationType: "bullet",
			navigationStyle: "round",
			shadow:0,
		});    
	}



	/******************************  Grid  *********************************/
	if($('#tt-grid-wrapper').length) {
		grid();
	}


	/*****************************  Filters  *******************************/
	if($('.filters').length) {
		$('.filters li').click(function (e) {
			e.preventDefault()
			
			filter = $(this).data('filter');

			$('.grid ul li').hide();
			$('.filters li').removeClass('active')

			$(this).addClass('active')
			
			if (filter == 'all'){
				$('.grid ul li').show()
			}else {
				$('.grid ul li.'+filter).show()
			}
		})
	}




}); //end document ready

