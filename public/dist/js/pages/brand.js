//Brand 
var brand_data = []
var default_brand = {
  name : "",
  _id: ""
}
var brandTableId = "#brandTable"
var brandModelId = "#brand-modal"
var brandNameId = "#brand_name"
var brandDbId = "#brand_id"
var brandModalTitle = "#brand-modal-title"
var brandDataColumns = 
[
  { title: "Name", data: null, render: 'name' },
  { data: '_id', render: function (data, type, row, meta) {
      return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editBrand(\''+data+'\')">Edit</button>':data
    } 
  }
]
function setBrandFormValues(row) {
  console.log('Set Brand Form');
  console.log(row);
  $(brandNameId).val(row.name);
  $(brandDbId).val(row._id);
}

function getBrandFormValues() {
  return {
    name : $(brandNameId).val(),
    _id: $(brandDbId).val()
  }
}

function getBrandUrl() {
  return used_host + '/brands'
}

function getBrandData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getBrandUrl(),
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
          brand_data = json.details
          initBrandTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting Brands");
        console.log(data);
    }
  });
}

function postBrandData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getBrandUrl(),
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
          notifyUser('danger', 'Server Error Saving Brand')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setBrandFormValues(default_brand)
          notifyUser('success', json.message)
          getAllBrands()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving Brand')
        console.log("Error Saving Brand");
        console.log(data);
    }
  });
}

function initBrandTable() {
  console.log('Brand Data');
  console.log(brand_data)
  $(brandTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": brand_data,
    "stateSave": true,
    "columns": brandDataColumns
  })
}

function getAllBrands() {
  getBrandData()
}

function addBrand(data) {
  console.log('Add brand');
  console.log(data);
  if(data) {
    if(data.name) {
      var row = $.grep(brand_data, function (n,i) {
        if(data._id) {
          if(n.name) {
            return n.name.toLowerCase() == data.name.toLowerCase()  && n._id != data._id
          }
        } else return n.name.toLowerCase() == data.name.toLowerCase()
      })
      if(row.length > 0) {
        notifyUser('warning', 'Brand With Name: '+data.name+ ' Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postBrandData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setBrandFormValues(default_brand)
    $(brandModalTitle).text('Add Brand')
    $(brandModelId).modal('show')
  }

}

function editBrand(data) {
  console.log('Edit Brand');
  console.log(data);
  
  var row = $.grep(brand_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setBrandFormValues(row[0])
    $(brandModalTitle).text('Edit Brand')
    $(brandModelId).modal('show')
  } else {
    console.log('Brand Row Not Found')
  }
}

$('#add_brand_button').click(function (pabrands) {
  var data = getBrandFormValues()
  console.log('Got Brand Form Values');
  console.log(data);
    
  addBrand(data)
})
