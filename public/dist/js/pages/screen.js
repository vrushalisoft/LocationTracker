//Screen 
var screen_data = []
var default_screen = {
  resolution : "",
  size : "",
  _id: ""
}
var screenTableId = "#screenTable"
var screenModelId = "#screen-modal"
var screenResolutionId = "#screen_resolution"
var screenSizeId = "#screen_size"
var screenDbId = "#screen_id"
var screenModalTitle = "#screen-modal-title"
var screenDataColumns = 
[
  { title: "Resolution", data: null, render: 'resolution' },
  { title: "Size", data: null, render: 'size' },
  { data: '_id', render: function (data, type, row, meta) {
      return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editScreen(\''+data+'\')">Edit</button>':data
    } 
  }
]
function setScreenFormValues(row) {
  console.log('Set Screen Form');
  console.log(row);
  $(screenResolutionId).val(row.resolution);
  $(screenSizeId).val(row.size);
  $(screenDbId).val(row._id);
}

function getScreenFormValues() {
  return {
    resolution : $(screenResolutionId).val(),
    size : $(screenSizeId).val(),
    _id: $(screenDbId).val()
  }
}

function getScreenUrl() {
  return used_host + '/screens'
}

function getScreenData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getScreenUrl(),
    xhrFields: {
        // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
        // This can be used to set the 'withCredentials' property.
        // Set the value to 'true' if you'd like to pass cookies to the server.
        // If this is enabled, your server must respond with the header
        // 'Access-Control-Allow-Credentials: true'.
        withCredentials: false
    },
    success: function (json) {
        if (!json.status) {
          console.error('Serverside Error While Geting Screens');
          console.error(json.message)
        }
        else {
          screen_data = json.details
          initScreenTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting Screens");
        console.log(data);
    }
  });
}

function postScreenData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getScreenUrl(),
    dataType: 'json',
    data: data,
    xhrFields: {
        // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
        // This can be used to set the 'withCredentials' property.
        // Set the value to 'true' if you'd like to pass cookies to the server.
        // If this is enabled, your server must respond with the header
        // 'Access-Control-Allow-Credentials: true'.
        withCredentials: false
    },
    success: function (json) {
        if (!json.status) {
          notifyUser('danger', 'Server Error Saving Screen')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setScreenFormValues(default_screen)
          notifyUser('success', json.message)
          getAllScreens()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving Screen')
        console.log("Error Saving Screen");
        console.log(data);
    }
  });
}

function initScreenTable() {
  console.log('Screen Data');
  console.log(screen_data)
  $(screenTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": screen_data,
    "stateSave": true,
    "columns": screenDataColumns
  })
}

function getAllScreens() {
  getScreenData()
}

function addScreen(data) {
  console.log('Add screen');
  console.log(data);
  if(data) {
    if(data.size) {
      var row = $.grep(screen_data, function (n,i) {
        if(data._id) {
          if(n.size) {
            return n.resolution.toLowerCase() == data.resolution.toLowerCase() && n.size.toLowerCase() == data.size.toLowerCase() && n._id != data._id
          }
        } else return n.resolution.toLowerCase() == data.resolution.toLowerCase() && n.size.toLowerCase() == data.size.toLowerCase()
      })
      if(row.length > 0) {
        notifyUser('warning', 'Screen With Type: '+data.resolution+' And Size: '+data.size+' Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postScreenData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setScreenFormValues(default_screen)
    $(screenModalTitle).text('Add Screen')
    $(screenModelId).modal('show')
  }

}

function editScreen(data) {
  console.log('Edit Screen');
  console.log(data);
  
  var row = $.grep(screen_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setScreenFormValues(row[0])
    $(screenModalTitle).text('Edit Screen')
    $(screenModelId).modal('show')
  } else {
    console.log('Screen Row Not Found')
  }
}

$('#add_screen_button').click(function (pascreens) {
  var data = getScreenFormValues()
  console.log('Got Screen Form Values');
  console.log(data);
    
  addScreen(data)
})
