function setCookie()  
    {  
        document.cookie="username=Vinoth Kumar";  
    }  
    function getCookie()  
    {
    var cookies = { };

    if (document.cookie && document.cookie != ”) 
        {
        var split = document.cookie.split(‘;’);
            for (var i = 0; i < split.length; i++) 
            {
            var name_value = split[i].split(“=”);
            name_value[0] = name_value[0].replace(/^ /, ”);
            cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
            }
        }
    return cookies;   
    }

    var cookies = get_cookies_array();
    for(var name in cookies) 
    {
    console.log( name + ” : ” + cookies[name] + “” );
    }
