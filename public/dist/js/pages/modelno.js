//ModelNo 
var modelno_data = []
var brand_data_for_Model = []
var default_modelno = {
  name : "",
  brandId : "",
  _id: ""
}
var modelnoTableId = "#modelnoTable"
var modelnoModelId = "#modelno-modal"
var modelnoNameId = "#modelno_name"
var modelnoDbId = "#modelno_id"
var modelnoModalTitle = "#modelno-modal-title"
var selectionBoxId = "#brand_id_selection_box"
var modelnoDataColumns = 
[
  { title: "Brand", data: null, render: 'brandName' },
  { title: "Name", data: null, render: 'name' },
  { data: '_id', render: function (data, type, row, meta) {
      return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editModelNo(\''+data+'\')">Edit</button>':data
    } 
  }
]
function setModelNoFormValues(row) {
  console.log('Set ModelNo Form');
  console.log(row);
  $(selectionBoxId).val(row.brandId).change();
  $(modelnoNameId).val(row.name);
  $(modelnoDbId).val(row._id);
}

function getModelNoFormValues() {
  return {
    brandId : $(selectionBoxId).children("option:selected").val(),
    name : $(modelnoNameId).val(),
    _id: $(modelnoDbId).val()
  }
}

function getModelNoUrl() {
  return used_host + '/modelnos'
}

function getBrandUrlForModel() {
  return used_host + '/brands'
}

function getModelNoData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getModelNoUrl(),
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
          console.error('Serverside Error While Geting ModelNos');
          console.error(json.message)
        }
        else {
          json.details.forEach(row => {
            var brand = $.grep(brand_data_for_Model, function (n,i) {
              return n._id == row.brandId
            })
            if (brand.length > 0) {
              row.brandName = brand[0].name
            } else {
              row.brandName = ""
            }
          });
          modelno_data = json.details
          initModelNoTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting ModelNos");
        console.log(data);
    }
  });
}

function getBrandDataForModel(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getBrandUrlForModel(),
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
          console.error('Serverside Error While Geting Brands');
          console.error(json.message)
        }
        else {
          brand_data_for_Model = json.details
          initBrandSelectionBox()
        }
    },
    error: function (data) {
        console.log("Error While Getting Brands");
        console.log(data);
    }
  });
}

function postModelNoData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getModelNoUrl(),
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
          notifyUser('danger', 'Server Error Saving ModelNo')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setModelNoFormValues(default_modelno)
          notifyUser('success', json.message)
          getAllModelNos()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving ModelNo')
        console.log("Error Saving ModelNo");
        console.log(data);
    }
  });
}

function initBrandSelectionBox(){
  $(selectionBoxId).empty()
  $(selectionBoxId).append($('<option>').val("").text('Select A Brand'))
  brand_data_for_Model.forEach(row => {
    $(selectionBoxId).append($('<option>').val(row._id).text(row.name))
  });
}

function initModelNoTable() {
  console.log('ModelNo Data');
  console.log(modelno_data)
  $(modelnoTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": modelno_data,
    "stateSave": true,
    "columns": modelnoDataColumns
  })
}

function getAllModelNos() {
  getBrandDataForModel()
  getModelNoData()
  
}

function addModelNo(data) {
  console.log('Add modelno');
  console.log(data);
  if(data) {
    if(data.name && data.brandId) {
      var row = $.grep(modelno_data, function (n,i) {
        if(data._id) {
          if(n.name) {
            return n.name.toLowerCase() == data.name.toLowerCase()  && n._id != data._id
          }
        } else return n.name.toLowerCase() == data.name.toLowerCase()
      })
      if(row.length > 0) {
        notifyUser('warning', 'ModelNo With Name: '+data.name+ ' Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postModelNoData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setModelNoFormValues(default_modelno)
    $(modelnoModalTitle).text('Add ModelNo')
    $(modelnoModelId).modal('show')
  }

}

function editModelNo(data) {
  console.log('Edit ModelNo');
  console.log(data);
  
  var row = $.grep(modelno_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setModelNoFormValues(row[0])
    $(modelnoModalTitle).text('Edit ModelNo')
    $(modelnoModelId).modal('show')
  } else {
    console.log('ModelNo Row Not Found')
  }
}

$('#add_modelno_button').click(function (pamodelnos) {
  var data = getModelNoFormValues()
  console.log('Got ModelNo Form Values');
  console.log(data);
    
  addModelNo(data)
})
