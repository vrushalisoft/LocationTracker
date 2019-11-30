//Storage 
var storage_data = []
var default_storage = {
  type : "hdd",
  size : "",
  _id: ""
}
var storageTableId = "#storageTable"
var storageModelId = "#storage-modal"
var storageTypeId = "#storage_type_selection_box"
var storageSizeId = "#storage_size"
var storageDbId = "#storage_id"
var storageModalTitle = "#storage-modal-title"
var storageDataColumns = 
[
  { title: "Type", data: null, render: 'type' },
  { title: "Size", data: null, render: 'size' },
  { data: '_id', render: function (data, type, row, meta) {
      return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editStorage(\''+data+'\')">Edit</button>':data
    } 
  }
]
function setStorageFormValues(row) {
  console.log('Set Storage Form');
  console.log(row);
  $(storageTypeId).val(row.type).change();
  $(storageSizeId).val(row.size);
  $(storageDbId).val(row._id);
}

function getStorageFormValues() {
  return {
    type : $(storageTypeId).children("option:selected").val(),
    size : $(storageSizeId).val(),
    _id: $(storageDbId).val()
  }
}

function getStorageUrl() {
  return used_host + '/storages'
}

function getStorageData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getStorageUrl(),
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
          console.error('Serverside Error While Geting Storages');
          console.error(json.message)
        }
        else {
          storage_data = json.details
          initStorageTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting Storages");
        console.log(data);
    }
  });
}

function postStorageData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getStorageUrl(),
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
          notifyUser('danger', 'Server Error Saving Storage')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setStorageFormValues(default_storage)
          notifyUser('success', json.message)
          getAllStorages()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving Storage')
        console.log("Error Saving Storage");
        console.log(data);
    }
  });
}

function initStorageTable() {
  console.log('Storage Data');
  console.log(storage_data)
  $(storageTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": storage_data,
    "stateSave": true,
    "columns": storageDataColumns
  })
}

function getAllStorages() {
  getStorageData()
}

function addStorage(data) {
  console.log('Add storage');
  console.log(data);
  if(data) {
    if(data.type && data.size) {
      var row = $.grep(storage_data, function (n,i) {
        if(data._id) {
          if(n.type && n.size) {
            return  n.type.toLowerCase() == data.type.toLowerCase() && n.size.toLowerCase() == data.size.toLowerCase() && n._id != data._id
          }
        } else return  n.type.toLowerCase() == data.type.toLowerCase() && n.size.toLowerCase() == data.size.toLowerCase()
      })
      if(row.length > 0) {
        notifyUser('warning', 'Storage With Type: '+data.type+' And Size: '+data.size+' Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postStorageData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setStorageFormValues(default_storage)
    $(storageModalTitle).text('Add Storage')
    $(storageModelId).modal('show')
  }

}

function editStorage(data) {
  console.log('Edit Storage');
  console.log(data);
  
  var row = $.grep(storage_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setStorageFormValues(row[0])
    $(storageModalTitle).text('Edit Storage')
    $(storageModelId).modal('show')
  } else {
    console.log('Storage Row Not Found')
  }
}

$('#add_storage_button').click(function (pastorages) {
  var data = getStorageFormValues()
  console.log('Got Storage Form Values');
  console.log(data);
    
  addStorage(data)
})
