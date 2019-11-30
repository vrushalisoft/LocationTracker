//SpareType 
var sparetype_data = []
var default_sparetype = {
  name : "",
  _id: ""
}
var sparetypeTableId = "#sparetypeTable"
var sparetypeModelId = "#sparetype-modal"
var sparetypeNameId = "#sparetype_name"
var sparetypeDbId = "#sparetype_id"
var sparetypeModalTitle = "#sparetype-modal-title"
var sparetypeDataColumns = 
[
  { title: "Name", data: null, render: 'name' },
  { data: '_id', render: function (data, type, row, meta) {
      return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editSpareType(\''+data+'\')">Edit</button>':data
    } 
  }
]
function setSpareTypeFormValues(row) {
  console.log('Set SpareType Form');
  console.log(row);
  $(sparetypeNameId).val(row.name);
  $(sparetypeDbId).val(row._id);
}

function getSpareTypeFormValues() {
  return {
    name : $(sparetypeNameId).val(),
    _id: $(sparetypeDbId).val()
  }
}

function getSpareTypeUrl() {
  return used_host + '/sparetypes'
}

function getSpareTypeData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getSpareTypeUrl(),
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
          console.error('Serverside Error While Geting SpareTypes');
          console.error(json.message)
        }
        else {
          sparetype_data = json.details
          initSpareTypeTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting SpareTypes");
        console.log(data);
    }
  });
}

function postSpareTypeData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getSpareTypeUrl(),
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
          notifyUser('danger', 'Server Error Saving SpareType')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setSpareTypeFormValues(default_sparetype)
          notifyUser('success', json.message)
          getAllSpareTypes()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving SpareType')
        console.log("Error Saving SpareType");
        console.log(data);
    }
  });
}

function initSpareTypeTable() {
  console.log('SpareType Data');
  console.log(sparetype_data)
  $(sparetypeTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": sparetype_data,
    "stateSave": true,
    "columns": sparetypeDataColumns
  })
}

function getAllSpareTypes() {
  getSpareTypeData()
}

function addSpareType(data) {
  console.log('Add sparetype');
  console.log(data);
  if(data) {
    if(data.name) {
      var row = $.grep(sparetype_data, function (n,i) {
        if(data._id) {
          if(n.name) {
            return n.name.toLowerCase() == data.name.toLowerCase()  && n._id != data._id
          }
        } else return n.name.toLowerCase() == data.name.toLowerCase()
      })
      if(row.length > 0) {
        notifyUser('warning', 'SpareType With Name: '+data.name+ ' Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postSpareTypeData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setSpareTypeFormValues(default_sparetype)
    $(sparetypeModalTitle).text('Add SpareType')
    $(sparetypeModelId).modal('show')
  }

}

function editSpareType(data) {
  console.log('Edit SpareType');
  console.log(data);
  
  var row = $.grep(sparetype_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setSpareTypeFormValues(row[0])
    $(sparetypeModalTitle).text('Edit SpareType')
    $(sparetypeModelId).modal('show')
  } else {
    console.log('SpareType Row Not Found')
  }
}

$('#add_sparetype_button').click(function (pasparetypes) {
  var data = getSpareTypeFormValues()
  console.log('Got SpareType Form Values');
  console.log(data);
    
  addSpareType(data)
})
