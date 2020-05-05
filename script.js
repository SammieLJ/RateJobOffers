"use strict"
let jobApplications = [];

// časovne enote
const minuta_v_ms = 60000; // 1000 ms je 1 sec
const delay_v_minutah = 1440; // 1440 minut je 24 ur

// aktiviraj paginacijo od vloge 5, torej če je tri ali več
const ACTIVATE_PAGINATION_ON_NUM = 5;

// spremenjivke z določanje stani in pomoč pri paginaciji
let trenutnaStran = 1;
let stStrani = 1;

const adminUporabniki = new Map();

// hardcoded admini - tukaj nastaviš svoje
adminUporabniki.set('janez', 'novak');
adminUporabniki.set('jože', 'božič');

let jeAdmin = false;

let illegalChars = ',#-/ !@$%^*(){}|[]\"1234567890';

function isNotAcceptedChar(s) {
      for (const c of s) {
        if (illegalChars.search(c) > -1) {
          return true;
        }
      }
      return false;
  }

function CheckNullUndefined(value) {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function showAdminForm() {
    $("#prijava_admina").show();

    // skrij vse tri forme, ki ne smejo biti prikazane
    $("#oddaja_vloge").hide();
    $("#vloga_oddana").hide();
    $("#pregled_vlog_admin").hide();
    $('#ni_objavljenih_vlog').hide();
  }

function showPregledVlog() {
  // skrij prve tri forme in odpri formo za pregled vlog
  $("#prijava_admina").hide();
  $("#oddaja_vloge").hide();
  $("#vloga_oddana").hide();
  $("#pregled_vlog_admin").show();

  // aktiviraj pregled vlog
  aktivirajPregledVlog();
}

function aktivirajPregledVlog() {
  // napolni sezname vlog
  const lokalneVloge = localStorage.getItem('jobApplications');
  jobApplications = JSON.parse(lokalneVloge);

  // preverimo, če je sploh kakšna vloga na voljo? Prikaži opozorilo, če ni vlog na voljo.
  if (jobApplications === null) {
    $("#pregled_vlog_admin").hide();
    $('#ni_objavljenih_vlog').show();
  } else {
    $('#ni_objavljenih_vlog').hide();
    $("#pregled_vlog_admin").show();

    // nafilaj pregled vlog s podatki, default je prva stran
    fillJobApplicationsWithData();

    // aktiviraj možnost rangiranja z zvezdicami
   /* rating.addEventListener('rate', () => {
      console.log('Rating: '+ rating.value + ', ID=' + $('#vloga_container > input[id="Id"]').val());
      updateRatingById($('#vloga_container > input[id="Id"]').val(), rating.value);
    });

    rating_soda.addEventListener('rate', () => {
      console.log('Rating: '+ rating_soda.value + ', ID=' + $('#vloga_container > input[id="Id"]').val());
      updateRatingById($('#vloga_soda_container > input[id="Id"]').val(), rating_soda.value);
    });
    */

    //Increment the idle time counter every minute.
    setInterval(timerLogOff, minuta_v_ms*delay_v_minutah); // nastavi timer za log off
  }
}

  function storeParticipantsToLocalStorage(jobApplication) {
    if ($.isEmptyObject(jobApplications)) {
      jobApplications = new Array();
    }
    jobApplications.push(jobApplication);
    console.log(jobApplications);
    localStorage.setItem('jobApplications', JSON.stringify(jobApplications));
  }

  function updateRatingById(Id, ratedValue) {
    //Find index of specific object using findIndex method.    
    let objIndex = jobApplications.findIndex((obj => obj.id == Id));
    console.log('STAR ID ...' + Id+ ',RATED VALUE ... ' + ratedValue);
    jobApplications[objIndex].ocena_vloge = ratedValue;
    localStorage.setItem('jobApplications', JSON.stringify(jobApplications));
  }

  function validateInputFields(first, last, address, opis_vloge) {
    if (CheckNullUndefined(first) || CheckNullUndefined(last) || CheckNullUndefined(address) || CheckNullUndefined(opis_vloge)) {
      alert("Vnosna polja ne smejo biti prazna! Preveri, če si vsa polja izpolnil?");
      return false;
    }
    /*if (isNotAcceptedChar(first) || isNotAcceptedChar(last)) {
      alert("Vnosna polja vsebujejo prepovedane znake! Preveri, če kaj si vpisal v ime, priimek?");
      return false;
    }*/
    if (first.length < 3 || first.length > 20) {
      alert("Polje ime ima prekratek ali predolg vnos. Namanj 3 znaki in največ 20 znakov je dovoljeno!");
      return false;
    }
    if (last.length < 3 || last.length > 20) {
      alert("Polje priimek ima prekratek ali predolg vnos. Namanj 3 znaki in največ 20 znakov je dovoljeno!");
      return false;
    }
    if (address.length < 3 || address.length > 30) {
      alert("Polje naslov ima prekratek ali predolg vnos. Namanj 3 znaki in največ 30 znakov je dovoljeno!");
      return false;
    }
    if (opis_vloge.length < 20 || opis_vloge.length > 400) {
      alert("Polje opis vloge ima prekratek ali predolg vnos. Namanj 20 znakov in največ 400 znakov je dovoljeno!");
      return false;
    }
    return true;
  }

  function addJobApplication() {
    // Get values
    const first = $("#first").val();
    const last = $("#last").val();
    const address = $("#address").val();
    const opis_vloge = $("#opis_vloge").val();
    let id = 0;

    // client side validation - first and last input ne smejo biti prazni!
    if (validateInputFields(first, last, address, opis_vloge)) {
        // get Id from jobApplications
        if (!$.isEmptyObject(jobApplications)) {
            id = jobApplications.length+1;
        } else {
          // seznam je prazen in prvič dodajemo element v vloge
          id=1;
        }

        // Create participant object
        const jobApplication = {
            id: id,
            first: first,
            last: last,
            address: address,
            opis_vloge: opis_vloge,
            ocena_vloge: 2
        };

        // Add participant to the HTML
        storeParticipantsToLocalStorage(jobApplication);

        // Set input fields to empty values
        $("#first").val("");
        $("#last").val("");
        $("#address").val("");
        $("#opis_vloge").val("Zakaj ste vi najbolj primerni za izbrano delo?");
        // Move cursor to the first name input field
        $("first").focus();
        // vrni true, da gre program naprej na naslednjo stran
        return true;
    } // konec if else client validacije
}

function getTrenutnaStan() {
  // ker tko mora biti, ker naloga tako zahteva.
  const trStran = localStorage.getItem('getTrenutnaStran');
        
  // če je prvič, potem je prazna spremenjivka
  if (trStran === undefined || trStran === null) {
    localStorage.setItem('getTrenutnaStran', '1');
    return 1;
  }
  return parseInt(trStran);
}

function setTrenutnaStan() {
  localStorage.setItem('getTrenutnaStran', trenutnaStran.toString());
}

function fillJobApplicationsWithData() {
  // izračunaj koliko strani potrebujemo
  let stVsehVlog = jobApplications.length;
  stStrani = Math.ceil(stVsehVlog/ACTIVATE_PAGINATION_ON_NUM);

  trenutnaStran = getTrenutnaStan();
  console.log('Število vseh vlog: ' + stVsehVlog + ', št. strani bo ' + stStrani);
  
  // popolni elemente na strani, pazi na aktivacijo paginacije. Generiraš DIV "vloga_container"
  let maxSteviloMeja = trenutnaStran*ACTIVATE_PAGINATION_ON_NUM;
  let minSteviloMeja = (trenutnaStran-1)*ACTIVATE_PAGINATION_ON_NUM;

  // add the container for job applications, naprej naslov
  //$("#pregled_vlog_admin").append('<h2 class="levo_poravnaj">PREJETE VLOGE</h2>');
  let cloneId = 1;
  let vlogaTmpl= new Array();
  let ratingScript = '<script type="text/javascript">'

  console.log("TRENUTNA STRAN ... " + trenutnaStran);
  jobApplications.forEach(function (value, i) {
    if (!$.isEmptyObject(value)) {
      if( i >= minSteviloMeja && i < maxSteviloMeja) {
          // info
          //console.log('Vrednososti spodnja meja:' + minSteviloMeja + ' max zg. meja ' + maxSteviloMeja);console.log(value);console.log('Index stran: ' + i);

          // Create participant object
          const singlVlogaTmpl = {
            clone_vloga_container: "vloga_container"+cloneId.toString(),
            clone_Id: value.id,
            clone_vloga_ime: value.first,
            clone_vloga_priimek: value.last,
            clone_vloga_naslov: value.address,
            clone_vloga_opis: value.opis_vloge,
            clone_rating: value.ocena_vloge,
            rating_name: "rating"+value.id
          };
          vlogaTmpl.push(singlVlogaTmpl);

          //console.log("LOOP STAGE ...... " + cloneId);

          var tmpl_temp = "{{:rating_id}}.addEventListener('rate', () => {" +
            "updateRatingById($('#{{:vloga_container_id}} > input[type=hidden]').val(), {{:rating_id}}.value);" +
          "});";

        
          let valueId = value.id.toString(); let vlogaContainerId = "vloga_container"+cloneId.toString(); let ratingId = "rating"+value.id;
        
          var html_temp = "";
          html_temp = tmpl_temp.replace(/{{:rating_id}}/g, ratingId);
          html_temp = html_temp.replace(/{{:vloga_container_id}}/g, vlogaContainerId);
          html_temp = html_temp.replace(/{{:vloga_id}}/g, valueId);
        
          ratingScript += html_temp;

          cloneId++;
        }
      }
  }); 

  //console.log("VLOGA TEMPLATE ARRAY: "); console.log(vlogaTmpl);
  $("#pregled_vlog_admin").empty();
  $("#pregled_vlog_admin").append('<h2 class="levo_poravnaj">PREJETE VLOGE</h2>');
  $("#pregled_vlog_admin").append('<a href="#" class="admin_odjava" onClick="timerLogOff()">ODJAVA</a>');

  var tmpl = $.templates("#vlogaContainerTemplate"); // Get compiled template
  var data = vlogaTmpl;           // Define data
  var html = tmpl.render(data);      // Render template using data - as HTML string

  $("#pregled_vlog_admin").append(html);
  $("#pregled_vlog_admin").append('<div class="pagination"></div><br />');

  // ****** set up internal pagination *********
  // še prej pobriši vse pagination elemente
  $(".pagination").empty();
  
  // če sta več kot dve vlogi, vklopimo paginacijo
  if (stVsehVlog > ACTIVATE_PAGINATION_ON_NUM) {

    let steviloStrani = Math.ceil(stVsehVlog/ACTIVATE_PAGINATION_ON_NUM);

    // na trenutni strani, pripravi, da je aktivna
    $(".pagination").append('<a href="#" id="levo">&lt;</a>');
    for(let i = 1; i <= steviloStrani; i++) {
      if (i == trenutnaStran) {
        $(".pagination").append('<a href="#" class="active" id='+i+'>' + i + '</a>');
      } else {
        $(".pagination").append('<a href="#" id='+i+'>' + i + '</a>');
      }
      // dodaj še fun. za zamenjavo strani
      $( ".pagination > a[id="+ i +"]").on( "click", change_trenutna_stran);
    }
    $(".pagination").append('<a href="#" id="desno">&gt;</a>');

    // pripravi paginator gumbe, ker zgornja fun. ti napolni elemente za paginacijo
    $( ".pagination > a[id='levo']").on( "click", change_to_levo);
    $( ".pagination > a[id='desno']").on( "click", change_to_desno );
  }
  // ******* konec filanja paginacije ****************

  // **** append ratingScript so we can rate Vloge - job applications
  ratingScript += '</script>';
  //console.log('RatingScript ...');console.log(ratingScript);
  $("footer").append(ratingScript);
}

function change_to_levo() {
  console.log( "Change page to the left, trenutna stran je " + trenutnaStran );
  if (trenutnaStran > 1) {
    trenutnaStran -= 1; setTrenutnaStan();
    fillJobApplicationsWithData();
  }
}

function change_to_desno() {
  console.log( "Change page to the left, trenutna stran je " + trenutnaStran );
  if (trenutnaStran < stStrani) {
    trenutnaStran += 1; setTrenutnaStan();
    fillJobApplicationsWithData();
  }
}

function change_trenutna_stran() {
  // pridobi id strani
  let idOfClickedButton = $(this).text();

  // če je na isti strani, ni potrebe po refreshu
  if (idOfClickedButton != trenutnaStran) {
    trenutnaStran = idOfClickedButton; setTrenutnaStan();
    fillJobApplicationsWithData();
  }
}

function timerLogOff() {
  jeAdmin = false;
  localStorage.setItem('getJeAdmin', 'false');
  trenutnaStran = 1; setTrenutnaStan();
  window.location.reload();
}

// The jQuery way of doing it
$(document).ready(() => {    
    // poveži gumbe z funkcionalnostjo
    // Hide forms which will be accessed further in SPA
    $("#oddaja_vloge").show();
    $("#vloga_oddana").hide();
    $("#prijava_admina").hide();
    $("#pregled_vlog_admin").hide();
    $('#ni_objavljenih_vlog').hide();

    // Display div forms - states
    $("#addButton").click(function(){
        if(addJobApplication()) {
          $("#oddaja_vloge").hide();
          $("#vloga_oddana").show();
        }
      });
    $("#addNewApplication").click(function(){
        $("#oddaja_vloge").show();
        $("#vloga_oddana").hide();
      });
    
    // ker tko mora biti, ker naloga tako zahteva.
    const getJeAdmin = localStorage.getItem('getJeAdmin');
        
    // če je prvič, potem je prazna spremenjivka
    if (getJeAdmin === undefined || getJeAdmin === null) {
      localStorage.setItem('getJeAdmin', 'false');
    }

    if (getJeAdmin === 'true') {
      jeAdmin = true;
      showPregledVlog();
    } else {
      jeAdmin = false;
    }
    
      // prijava administratorja
      $("#addAdminLogin").click(function(){
        let admin_ime = $.trim($("#admin_upor_ime").val());
        let admin_geslo = $.trim($("#admin_upor_geslo").val());

        if (CheckNullUndefined(admin_ime) || CheckNullUndefined(admin_geslo)) {
          alert("Vnosna polja ne smejo biti prazna! Preveri, če si vsa polja izpolnil?");
          return false;
        }

        if ( adminUporabniki.get(admin_ime) === admin_geslo ) {
            // admin upor. ime in geslo sta pravilna
            $("#prijava_admina").hide();
            $("#pregled_vlog_admin").show();

            jeAdmin = true;
            localStorage.setItem('getJeAdmin', 'true');

            // aktiviraj pregled vlog
            aktivirajPregledVlog();
        } else {
            alert('Napačno admin uporabniško ime in geslo');
        }
      });

      // napolni objekt vloge - jobApplications
      // load local data - podaj v admin, ne pustit, da ob prvem loadu napolni skrite div-e
      const lokalneVloge = localStorage.getItem('jobApplications');
      //console.log(lokalneVloge);
      if (lokalneVloge !== undefined || lokalneVloge !== null) {
          jobApplications = JSON.parse(lokalneVloge);
      }
});