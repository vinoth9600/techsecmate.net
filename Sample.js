function setCookie()  
    {  
        document.cookie="username=Vinoth Kumar";  
    }  
    function getCookie()  
    {  
        if(document.cookie.length!=0)  
        {  
            var array=document.cookie.split("=");  
        alert("Name="+array[0]+" "+"Value="+array[1]);  
        }  
        else  
        {  
        alert("Cookie not available");  
        }  
    }  