var second_per_one_tour = 6;
var svg, width, height,
data=[], 
force, 
id = 0,
working = true,
state = {
  R: 0.5,
  theta: 0,
  d_R: 0,
  d_theta: 6/second_per_one_tour,
  delta_r: 100,
  tau: 50,
  omega: 1,
  u: 0,
  radius: 100,
  red: 250,
  blue: 0,
  green: 0
};

///  FORCE AND DRAWINGS

function update(){
  var circle = svg.selectAll("circle")
    .data(data, function(d) { return d.id; });
  circle
    .enter()
      .append("circle")
  circle
      .attr("cx", d=>d.x||0)
      .attr("cy", d=>d.y||0)
      .attr("r", d=>d.R)
      .attr("mask", "url(#fade)")
      .attr("fill", d=>'rgb('+~~d.r+','+~~d.g+','+~~d.b+')');
  circle
    .exit()
      .remove();
}

function addNode(n) {
  data.push(n);
  if(data.length > (second_per_one_tour-1)*1000/state.tau) data.shift();
  force.start();
}

function startForce(){
  force = d3.layout.force()
    .charge(-10)
    .friction(0.6)
    .gravity(0.0003)
    .size([width, height])
    .nodes(data)
    .on("tick", update)
    .start();
}

/// USE OF STATE TO DRAW

function newStep(){
  addNode((s=>({
      id: id++,
      x: width/2 + Math.random()*s.delta_r + s.R*Math.sin(s.theta)*(width+height)/4,
      y: height/2 + Math.random()*s.delta_r + s.R*Math.cos(s.theta)*(width+height)/4,
      r: s.red,
      g: s.green,
      b: s.blue,
      R: s.radius
    }))(state));
  state.theta += state.d_theta * state.tau / 1000;
  if(working) setTimeout(newStep, state.tau);
}


/// FACES TREATMENT

let changesList = {
  joy: {
    red: 255, blue: 18, green: 216
  },
  sadness: {
    red: 83, blue: 223, green: 111
  },
  anger: {
    red: 198, blue: 69, green: 43
  },
  fear: {
    red: 177, blue: 199, green: 103
  }
}

function updateFromFaces(faces){
  let without = ["valence", "engagement", "disgust", "contempt", "surprise"];
  if(faces[0] && faces[0].emotions){
    Object.assign(state, changesList[getMaxOf(faces[0].emotions, without)]);
    if(!working){working = true; newStep();}
  }else{
    working = false;
  }
  $('#my_results').html("");
  $('#my_results').append((faces[0] && faces[0].emotions) ? getMaxOf(faces[0].emotions, without) : "--");
}

function getMaxOf(obj, without=[]){
  return Object.keys(obj).reduce((mk, k) =>((without.indexOf(k) === -1 && (mk === 0 || obj[k] > obj[mk])) ? k : mk), 0);
}


$(document).ready(function(){
  svg = d3.select("svg");
  width = $('svg').width();
  height = $('svg').height();

  let ex_value = [{
      "emotions":{
        "joy":0.0017805361421778798,
        "sadness":0.02360813319683075,
        "disgust":0.42583543062210083,
        "contempt":0.1928381323814392,
        "anger":0.0019146931590512395,
        "fear":0.004466309677809477,
        "surprise":0.20143498480319977,
        "valence":0,
        "engagement":0.08394110947847366
      },
      "expressions":{
        "smile":2.1452257747966996e-9,
        "innerBrowRaise":0.06311342865228653,
        "browRaise":0.7663952708244324,
        "browFurrow":0.04553000628948212,
        "noseWrinkle":0.00003759590981644578,
        "upperLipRaise":4.884504534174994e-8,
        "lipCornerDepressor":0.08602098375558853,
        "chinRaise":0.00426156772300601,
        "lipPucker":0.013081245124340057,
        "lipPress":0.037366271018981934,
        "lipSuck":0.0252857506275177,
        "mouthOpen":0.0637756884098053,
        "smirk":0.000020385317839100026,
        "eyeClosure":4.4345208061180585e-10,
        "attention":79.50386047363281,
        "lidTighten":0.0007511288276873529,
        "jawDrop":0.22753432393074036,
        "dimpler":0.019882623106241226,
        "eyeWiden":0.15623338520526886,
        "cheekRaise":0.000055370332120219246,
        "lipStretch":0.0021331014577299356
      },
      "emojis":{
        "relaxed":0,
        "smiley":0,
        "laughing":0,
        "kissing":0,
        "disappointed":0,
        "rage":0,
        "smirk":0,
        "wink":0,
        "stuckOutTongueWinkingEye":0,
        "stuckOutTongue":0,
        "flushed":0,
        "scream":0,
        "dominantEmoji":"😐"
      },
      "appearance":{},
      "measurements":{
        "interocularDistance":145.01893615722656,
        "orientation":{
          "pitch":13.40406322479248,
          "yaw":15.222156524658203,
          "roll":-0.022369133308529854
        }
      },
      "featurePoints":{"0":{"x":60.42496109008789,"y":222.79537963867188},"1":{"x":87.11620330810547,"y":289.4118347167969},"2":{"x":154.29351806640625,"y":324.573486328125},"3":{"x":249.607666015625,"y":300.4356994628906},"4":{"x":294.2896728515625,"y":235.52676391601562},"5":{"x":69.46784210205078,"y":133.60667419433594},"6":{"x":93.97956848144531,"y":111.2802505493164},"7":{"x":133.36154174804688,"y":110.38874816894531},"8":{"x":174.2184600830078,"y":109.46571350097656},"9":{"x":225.3206787109375,"y":109.26091003417969},"10":{"x":259.9874572753906,"y":138.87265014648438},"11":{"x":150.8110809326172,"y":138.37905883789062},"12":{"x":143.69656372070312,"y":167.17845153808594},"13":{"x":126.2764663696289,"y":195.6959991455078},"14":{"x":149.11050415039062,"y":195.28135681152344},"15":{"x":175.94308471679688,"y":196.33322143554688},"16":{"x":88.80592346191406,"y":148.68951416015625},"17":{"x":129.08448791503906,"y":147.09617614746094},"18":{"x":188.85597229003906,"y":146.14724731445312},"19":{"x":233.81851196289062,"y":147.3323516845703},"20":{"x":111.03459930419922,"y":254.1477813720703},"21":{"x":139.0174560546875,"y":229.84286499023438},"22":{"x":150.23770141601562,"y":232.0876922607422},"23":{"x":162.6260223388672,"y":230.06436157226562},"24":{"x":200.235595703125,"y":253.0614776611328},"25":{"x":178.39166259765625,"y":261.4955139160156},"26":{"x":149.05035400390625,"y":263.82269287109375},"27":{"x":124.10672760009766,"y":262.3233642578125},"28":{"x":150.5812530517578,"y":243.3350830078125},"29":{"x":149.3501739501953,"y":250.2444305419922},"30":{"x":106.58345031738281,"y":136.93280029296875},"31":{"x":107.37484741210938,"y":152.5917510986328},"32":{"x":211.3312225341797,"y":135.96743774414062},"33":{"x":211.83737182617188,"y":151.37423706054688}}}];

  $(document).keyup(function(e) {
       if (e.keyCode == 27) setTimeout(()=>{working = false;}, 10);
  });
});

