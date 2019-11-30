//ItemType 
var itemtype_data = []
var default_itemtype = {
  name : "",
  _id: ""
}
var itemtypeTableId = "#itemtypeTable"
var itemtypeModelId = "#itemtype-modal"
var itemtypeNameId = "#itemtype_name"
var itemtypeDbId = "#itemtype_id"
var itemtypeModalTitle = "#itemtype-modal-title"
var itemtypeDataColumns = 
[
  { title: "Name", data: null, render: 'name' },
  { data: '_id', render: function (data, type, row, meta) {
      return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editItemType(\''+data+'\')">Edit</button>':data
    } 
  }
]
function setItemTypeFormValues(row) {
  console.log('Set ItemType Form');
  console.log(row);
  $(itemtypeNameId).val(row.name);
  $(itemtypeDbId).val(row._id);
}

function getItemTypeFormValues() {
  return {
    name : $(itemtypeNameId).val(),
    _id: $(itemtypeDbId).val()
  }
}

function getItemTypeUrl() {
  return used_host + '/itemtypes'
}

function getItemTypeData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getItemTypeUrl(),
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
          console.error('Serverside Error While Geting ItemTypes');
          console.error(json.message)
        }
        else {
          itemtype_data = json.details
          initItemTypeTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting ItemTypes");
        console.log(data);
    }
  });
}

function postItemTypeData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getItemTypeUrl(),
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
          notifyUser('danger', 'Server Error Saving ItemType')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setItemTypeFormValues(default_itemtype)
          notifyUser('success', json.message)
          getAllItemTypes()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving ItemType')
        console.log("Error Saving ItemType");
        console.log(data);
    }
  });
}

function initItemTypeTable() {
  console.log('ItemType Data');
  console.log(itemtype_data)
  $(itemtypeTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": itemtype_data,
    "stateSave": true,
    "columns": itemtypeDataColumns
  })
}

function getAllItemTypes() {
  getItemTypeData()
}

function addItemType(data) {
  console.log('Add itemtype');
  console.log(data);
  if(data) {
    if(data.name) {
      var row = $.grep(itemtype_data, function (n,i) {
        if(data._id) {
          if(n.name) {
            return n.name.toLowerCase() == data.name.toLowerCase()  && n._id != data._id
          }
        } else return n.name.toLowerCase() == data.name.toLowerCase()
      })
      if(row.length > 0) {
        notifyUser('warning', 'ItemType With Name: '+data.name+ ' Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postItemTypeData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setItemTypeFormValues(default_itemtype)
    $(itemtypeModalTitle).text('Add ItemType')
    $(itemtypeModelId).modal('show')
  }

}

function editItemType(data) {
  console.log('Edit ItemType');
  console.log(data);
  
  var row = $.grep(itemtype_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setItemTypeFormValues(row[0])
    $(itemtypeModalTitle).text('Edit ItemType')
    $(itemtypeModelId).modal('show')
  } else {
    console.log('ItemType Row Not Found')
  }
}

$('#add_itemtype_button').click(function (paitemtypes) {
  var data = getItemTypeFormValues()
  console.log('Got ItemType Form Values');
  console.log(data);
    
  addItemType(data)
})
