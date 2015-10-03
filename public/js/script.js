$(document).ready(function() {


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
				elem.append("<div class='loading alert'>Enviando...</div>");
			},
			success : function(response) {
				elem.append('Enviado!');
				elem.find(".loading").hide();
				elem.find("input[type='text'],input[type='email'],textarea").val("");
				elem.find("input[type='submit']").prop('disabled', true);
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

