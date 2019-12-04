//AssetDetails 
var asset_details_data = []
var default_asset_details = {
  total_assets: "",
  name: "", 
  image : "",
  height: "",
  width: "",
  channel: "",
  program: "",
  merchandise_type: "",
  promotion: "",
  mfg_day: "",
  mfg_month: "",
  mfg_year: "",
  est_shipping_day: "",
  est_shipping_month: "",
  est_shipping_year:"",
  day: "",
  month: "",
  year: "",
  active: "",
 
}
var asset_detailsTableId = "#asset_detailsTable"
var asset_detailsModelId = "#asset_details-modal"
var asset_detailsModalTitle = "#asset_details-modal-title"
var asset_detailsAssetDetailsName = "#asset_details_name"
var asset_detailsStreet = "#asset_details_street"
var asset_detailsCity = "#asset_details_city" 
var asset_detailsState = "#asset_details_state"
var asset_detailsZip = "#asset_details_zip"
var asset_detailsId = "#asset_details_id"
var asset_detailsDataColumns = 
[
  { title: "AssetDetails Name", data: null, render: 'asset_details_name' },
  { title: "Street", data: null, render: 'street' },
  { title: "City", data: null, render: 'city' },
  { title: "State", data: null, render: 'state' },
  { title: "Zip", data: null, render: 'zip' },
  { title: "Date_Recorded", data: null, render: function (data, type, row, meta) {
      return data.day + '/' + data.month + '/' + data.year 
    } 
  },
  { title: "", data: null, render: function (data, type, row, meta) {
      return data.active ? '<span style="color:green">Active</span>' : '<span style="color:red">Not Active</span>'
    } 
  },
  { data: '_id', render: function (data, type, row, meta) {
    return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editAssetDetails(\''+data+'\')">Edit</button>':data
  },
}
]
function setAssetDetailsFormValues(row) {
  console.log('Set AssetDetails Form');
  console.log(row);
  $(asset_detailsId).val(row._id);
  $(asset_detailsAssetDetailsName).val(row.asset_details_name);
  $(asset_detailsStreet).val(row.street);
  $(asset_detailsCity).val(row.city);
  $(asset_detailsState).val(row.state);
  $(asset_detailsZip).val(row.zip);
}

function getAssetDetailsFormValues() {
  return {
    asset_details_name:$(asset_detailsAssetDetailsName).val(),
    street:$(asset_detailsStreet).val(),
    city:$(asset_detailsCity).val(),
    state:$(asset_detailsState).val(),
    zip:$(asset_detailsZip).val(),
    _id: $(asset_detailsId).val()
  
  }
}

function getAssetDetailsUrl() {
  return used_host + '/asset_details'
}

function getAssetDetailsData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getAssetDetailsUrl()+'/all',
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
          console.error('Serverside Error While Geting AssetDetailss');
          console.error(json.message)
        }
        else {
          asset_details_data = json.details
          initAssetDetailsTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting AssetDetailss");
        console.log(data);
    }
  });
}

function postAssetDetailsData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getAssetDetailsUrl(),
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
          notifyUser('danger', 'Server Error Saving AssetDetails')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setAssetDetailsFormValues(default_asset_details)
          notifyUser('success', json.message)
          getAllAssetDetailss()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving AssetDetails')
        console.log("Error Saving AssetDetails");
        console.log(data);
    }
  });
}

function initAssetDetailsTable() {
  console.log('AssetDetails Data');
  console.log(asset_details_data)
  $(asset_detailsTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": asset_details_data,
    "stateSave": true,
    "columns": asset_detailsDataColumns
  })
}

function getAllAssetDetailss() {
  getAssetDetailsData()
}

function addAssetDetails(data) {
  console.log('Add AssetDetails');
  console.log(data);
  if(data) {
    if(data.asset_details_name && data.street && data.city && data.state && data.zip ) {
      var row = $.grep(asset_details_data, function (n,i) {
        if(data._id) {
          if( n.asset_details_name && n.street && n.city && n.state && n.zip ) {
            return n.asset_details_name.toLowerCase() == data.asset_details_name.toLowerCase() && n.street.toLowerCase() == data.street.toLowerCase() && n.city.toLowerCase() == data.city.toLowerCase() && n.state.toLowerCase() == data.state.toLowerCase() && n.zip.toLowerCase() == data.zip.toLowerCase()  && n._id != data._id
          }
        } else return n.asset_details_name.toLowerCase() == data.asset_details_name.toLowerCase() && n.street.toLowerCase() == data.street.toLowerCase() && n.city.toLowerCase() == data.city.toLowerCase() && n.state.toLowerCase() == data.state.toLowerCase() && n.zip.toLowerCase() == data.zip.toLowerCase() 
      })
      if(row.length > 0) {
        notifyUser('warning', 'AssetDetails With AssetDetails Name: '+data.asset_details_name+  'Or AssetDetails With street: '+data.street + 'Or AssetDetails With City: '+data.city + 'Or AssetDetails With state: '+data.state + 'Or AssetDetails With Zip: '+data.zip +'Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postAssetDetailsData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setAssetDetailsFormValues(default_asset_details)
    $(asset_detailsModalTitle).text('Add AssetDetails')
    $(asset_detailsModelId).modal('show')
  }

}

function editAssetDetails(data) {
  console.log('Edit AssetDetails');
  console.log(data);
  
  var row = $.grep(asset_details_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setAssetDetailsFormValues(row[0])
    $(asset_detailsModalTitle).text('Edit AssetDetails')
    $(asset_detailsModelId).modal('show')
  } else {
    console.log('AssetDetails Row Not Found')
  }
}

$('#add_asset_details_button').click(function (params) {
  var data = getAssetDetailsFormValues()
  if(!data._id){
    data.day = today.getDate();
    data.month = today.getMonth() + 1;
    data.year= today.getFullYear();
    data.active = false;
  }
  console.log('Got AssetDetails Form Values');
  console.log(data);
    
  addAssetDetails(data)
})
