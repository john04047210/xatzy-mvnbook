(function($){
	$.extend($.fn.validatebox.defaults.rules, {
	    phone: {
	        validator: function(value){
	            return /^1[3|4|5|7|8][0-9]\d{4,8}$/.test(value);
	        },
	        message: 'Please enter a valid mobile phone number.'
	    },
	    number: {
	        validator: function(value, params){
	            var len = $.trim(value).length;
	            var bool = (len >= params[0] && len <= params[1]);
	            if(bool) {
	                return /^[1-9]\d*?$/.test(value);
	            }
	            return false;
	        },
	        message: 'Please enter a valid number[len range {0} to {1} ] and not begin with 0.'
	    }
	});
})(jQuery);