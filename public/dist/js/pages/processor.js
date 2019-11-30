//Processor 
var processor_data = []
var default_processor = {
  name : "",
  speed : "",
  _id: ""
}
var processorTableId = "#processorTable"
var processorModelId = "#processor-modal"
var processorModalTitle = "#processor-modal-title"
var processorDataColumns = 
[
  { title: "Name", data: null, render: 'name' },
  { title: "Speed (Ghz)", data: null, render: 'speed' },
  { data: '_id', render: function (data, type, row, meta) {
      return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editProcessor(\''+data+'\')">Edit</button>':data
    } 
  }
]
function setProcessorFormValues(row) {
  console.log('Set Process Form');
  console.log(row);
  $('#processor_id').val(row._id);
  $('#processor_name').val(row.name);
  $('#processor_speed').val(row.speed);
}

function getProcessorFormValues() {
  return {
    name : $('#processor_name').val(),
    speed : $('#processor_speed').val(),
    _id: $('#processor_id').val()
  }
}

function getProcessorUrl() {
  return used_host + '/processor'
}

function getProcessorData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getProcessorUrl(),
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
          console.error('Serverside Error While Geting Processors');
          console.error(json.message)
        }
        else {
          processor_data = json.details
          initProcessorTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting Processors");
        console.log(data);
    }
  });
}

function postProcessorData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getProcessorUrl(),
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
          notifyUser('danger', 'Server Error Saving Processor')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setProcessorFormValues(default_processor)
          notifyUser('success', json.message)
          getAllProcessors()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving Processor')
        console.log("Error Saving Processor");
        console.log(data);
    }
  });
}

function initProcessorTable() {
  console.log('Processor Data');
  console.log(processor_data)
  $(processorTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": processor_data,
    "stateSave": true,
    "columns": processorDataColumns
  })
}

function getAllProcessors() {
  getProcessorData()
}

function addProcessor(data) {
  console.log('Add process');
  console.log(data);
  if(data) {
    if(data.name) {
      var row = $.grep(processor_data, function (n,i) {
        if(data._id) {
          if(n.name) {
            return n.name.toLowerCase() == data.name.toLowerCase() && n.speed.toLowerCase() == data.speed.toLowerCase() && n._id != data._id
          }
        } else return n.name.toLowerCase() == data.name.toLowerCase() && n.speed.toLowerCase() == data.speed.toLowerCase()
      })
      if(row.length > 0) {
        notifyUser('warning', 'Processor With Name: '+data.name+' Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postProcessorData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setProcessorFormValues(default_processor)
    $(processorModalTitle).text('Add Processor')
    $(processorModelId).modal('show')
  }

}

function editProcessor(data) {
  console.log('Edit Process');
  console.log(data);
  
  var row = $.grep(processor_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setProcessorFormValues(row[0])
    $(processorModalTitle).text('Edit Processor')
    $(processorModelId).modal('show')
  } else {
    console.log('Processor Row Not Found')
  }
}

$('#add_processor_button').click(function (params) {
  var data = getProcessorFormValues()
  console.log('Got Process Form Values');
  console.log(data);
    
  addProcessor(data)
})
