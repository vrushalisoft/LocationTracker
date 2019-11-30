//Ram 
var ram_data = []
var default_ram = {
  type : "",
  size : "",
  _id: ""
}
var ramTableId = "#ramTable"
var ramModelId = "#ram-modal"
var ramTypeId = "#ram_type"
var ramSizeId = "#ram_size"
var ramDbId = "#ram_id"
var ramModalTitle = "#ram-modal-title"
var ramDataColumns = 
[
  { title: "Type", data: null, render: 'type' },
  { title: "Size", data: null, render: 'size' },
  { data: '_id', render: function (data, type, row, meta) {
      return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editRam(\''+data+'\')">Edit</button>':data
    } 
  }
]
function setRamFormValues(row) {
  console.log('Set Ram Form');
  console.log(row);
  $(ramTypeId).val(row.type);
  $(ramSizeId).val(row.size);
  $(ramDbId).val(row._id);
}

function getRamFormValues() {
  return {
    type : $(ramTypeId).val(),
    size : $(ramSizeId).val(),
    _id: $(ramDbId).val()
  }
}

function getRamUrl() {
  return used_host + '/ram'
}

function getRamData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getRamUrl(),
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
          console.error('Serverside Error While Geting Rams');
          console.error(json.message)
        }
        else {
          ram_data = json.details
          initRamTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting Rams");
        console.log(data);
    }
  });
}

function postRamData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getRamUrl(),
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
          notifyUser('danger', 'Server Error Saving Ram')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setRamFormValues(default_ram)
          notifyUser('success', json.message)
          getAllRams()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving Ram')
        console.log("Error Saving Ram");
        console.log(data);
    }
  });
}

function initRamTable() {
  console.log('Ram Data');
  console.log(ram_data)
  $(ramTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": ram_data,
    "stateSave": true,
    "columns": ramDataColumns
  })
}

function getAllRams() {
  getRamData()
}

function addRam(data) {
  console.log('Add ram');
  console.log(data);
  if(data) {
    if(data.type && data.size) {
      var row = $.grep(ram_data, function (n,i) {
        if(data._id) {
          if(n.type && n.size) {
            return n.type.toLowerCase() == data.type.toLowerCase() && n.size.toLowerCase() == data.size.toLowerCase() && n._id != data._id
          }
        } else return n.type.toLowerCase() == data.type.toLowerCase() && n.size.toLowerCase() == data.size.toLowerCase()
      })
      if(row.length > 0) {
        notifyUser('warning', 'Ram With Type: '+data.type+' And Size: '+data.size+' Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postRamData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setRamFormValues(default_ram)
    $(ramModalTitle).text('Add Ram')
    $(ramModelId).modal('show')
  }

}

function editRam(data) {
  console.log('Edit Ram');
  console.log(data);
  
  var row = $.grep(ram_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setRamFormValues(row[0])
    $(ramModalTitle).text('Edit Ram')
    $(ramModelId).modal('show')
  } else {
    console.log('Ram Row Not Found')
  }
}

$('#add_ram_button').click(function (params) {
  var data = getRamFormValues()
  console.log('Got Ram Form Values');
  console.log(data);
    
  addRam(data)
})
