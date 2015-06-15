var container;
var camera, scene, projector, renderer;
var particleMaterial;
var offsetX = 0;
var offsetY = 0;
 var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;
var cameraOffset = viewWidth;
var objects = [];          


window.onload=function()
{
    init();    
}

function init() {

    container = document.getElementById( 'containerDiv' );				
    viewWidth = container.offsetWidth;
    viewHeight = container.offsetHeight;                
    cameraOffset = viewWidth;
    
    camera = new THREE.PerspectiveCamera( 70, viewWidth/viewHeight, 1, 10000 );
    camera.position.set( 0, 0, cameraOffset );

    scene = new THREE.Scene();

    var geometry = new THREE.BoxGeometry( 100, 100, 100 );
    

    var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x0000ff, opacity: 1 } ) );
    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0;

    object.scale.x = 1;
    object.scale.y = 1;
    object.scale.z = 1;

    object.rotation.x = Math.PI / 4;
    object.rotation.y = Math.PI / 4;
    object.rotation.z = Math.PI / 4;

    scene.add( object );

    objects.push( object );


    var PI2 = Math.PI * 2;
    particleMaterial = new THREE.SpriteCanvasMaterial( {

        color: 0x000000,
        program: function ( context ) {

            context.beginPath();
            context.arc( 0, 0, 0.5, 0, PI2, true );
            context.fill();

        }

    } );

    projector = new THREE.Projector();

    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setSize( viewWidth, viewHeight );
    container.appendChild( renderer.domElement );

    renderer.domElement.addEventListener( 'mousedown', onCanvasMouseDown, false );				
    
    camera.lookAt(new THREE.Vector3(0,0,0));              
    render();
}			

function addNewParticle(pos, scale)
{
    if( !scale )
    {
        scale = 16;
    }
    var particle = new THREE.Sprite( particleMaterial );
    particle.position = pos;
    particle.scale.x = particle.scale.y = scale;
    scene.add( particle );
}

function drawLine(pointA, pointB, lineColor)
{            
    var material = new THREE.LineBasicMaterial({
            color: lineColor
    });

    var geometry = new THREE.Geometry();
    var max = 500*500;
    if( Math.abs(pointA.x - pointB.x) < max && Math.abs(pointA.y - pointB.y) < max && Math.abs(pointA.z - pointB.z) < max )
    {
        geometry.vertices.push(pointA);
        geometry.vertices.push(pointB);
                        
        var line = new THREE.Line(geometry, material);
        scene.add(line);      
    }
    else
    {
        console.debug(pointA.x.toString() + ':' + pointA.y.toString() + ':' + pointA.z.toString()  + ':' + 
                    pointB.x.toString() + ':' + pointB.y.toString()  + ':' + pointB.z.toString());
    }
}
var orbitStep = 0;
var orbitSteps = 100;
var inOrbit = false;
function doOrbit()
{
    if( orbitStep < orbitSteps )
    {
        var prop = orbitStep / orbitSteps;
        var radians = Math.PI / 2 + 2 * Math.PI * prop;
        var newX = cameraOffset * Math.cos(radians);
        var newZ = cameraOffset * Math.sin(radians);
        camera.position.set( newX, 0, newZ );
        orbitStep++;
    }
    else
    {
        inOrbit = false;
        camera.position.set( 0, 0, cameraOffset );
        orbitStep = 0;        
    }                
    camera.lookAt(new THREE.Vector3(0,0,0));
    render();
}

function getFactorPos( val, factor, step )
{
    return step / factor * val;                
}

function drawParticleLine(pointA,pointB)
{
    var factor = 50;
    for( var i = 0; i < factor; i++ )
    {
        var x = getFactorPos( pointB.x - pointA.x, factor, i );
        var y = getFactorPos( pointB.y - pointA.y, factor, i );
        var z = getFactorPos( pointB.z - pointA.z, factor, i );
        addNewParticle( new THREE.Vector3( pointA.x+x,pointA.y+y,pointA.z+z ), Math.max(2, viewWidth / 500 ) );
    }
}

function drawRayLine(rayCaster)
{
    var scale = viewWidth*2;
    var rayDir = new THREE.Vector3(rayCaster.ray.direction.x*scale,rayCaster.ray.direction.y*scale,rayCaster.ray.direction.z*scale);
    var rayVector = new THREE.Vector3(camera.position.x + rayDir.x, camera.position.y + rayDir.y, camera.position.z + rayDir.z);
    drawParticleLine(camera.position, rayVector);
}                       

function calcOffsets()
{
    var rect = container.getBoundingClientRect();                                
    offsetX = rect.left;
    offsetY = rect.top;
}

function onCanvasMouseDown( event ) {

    if( inOrbit )
    {
        return;
    }
    inOrbit = true;                
    event.preventDefault();
    calcOffsets();
    
    var mouse3D = new THREE.Vector3( ( event.clientX - offsetX ) / viewWidth * 2 - 1,
                            -( event.clientY - offsetY ) / viewHeight * 2 + 1,
                            0.5 );
    
    projector.unprojectVector( mouse3D, camera );                                                           
    mouse3D.sub( camera.position );
    mouse3D.normalize();
    var rayCaster = new THREE.Raycaster( camera.position, mouse3D );
    
    drawRayLine( rayCaster );//draw the line to show the projection - you would not normally do this.
    
    var intersects = rayCaster.intersectObjects( objects );
    // Change color if hit block
    if ( intersects.length > 0 ) {

        intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
    }	
    render();
    requestAnimationFrame( animate );
}

//

function animate() {    
    if( inOrbit )
    {
        doOrbit();
        requestAnimationFrame( animate );
    }    
}

var radius = 600;
var theta = 0;

function render() {				
    renderer.render( scene, camera );
}