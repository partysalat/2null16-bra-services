'use strict';
var rewire = require("rewire");
describe('gphoto', function () {
  var GPhoto, gphotoCliService;
  var CIAD_DATA;
  beforeEach(function () {
    CIAD_DATA = [
      new Buffer('New file is in location /capt0000.jpg on the camera'),
      new Buffer('Saving file as ~/braimages/1460393800708.jpg'),
      new Buffer(''),
      new Buffer('Deleting file /capt0000.jpg on the camera')
    ];
    GPhoto = rewire('../../../../src/server/bluetooth/camera/gphoto/index');
    gphotoCliService = jasmine.createSpyObj("gphotoCliService",["spawnGphoto",'spawnGphotoAsStream']);
    GPhoto.__set__("gphotoCliService", gphotoCliService);
  });

  it('should be defined', function () {
    expect(GPhoto).toBeDefined();
  });
  it('not to throw error on instantiation', function () {
    expect(function () {
      new GPhoto();
    }).not.toThrow();
  });
  it('not to throw error on instantiation', function () {
    expect(function () {
      GPhoto();
    }).not.toThrow();
    expect(GPhoto()).toEqual(jasmine.any(GPhoto));
  });

  describe("caputePicture", function () {
    var gphoto;
    beforeEach(function () {
      gphoto = new GPhoto();
    });
    it("should not throw an error on call", function () {
      expect(function () {
        gphoto.captureImage();
      }).not.toThrow();
    });
    it("should call spawn with gphoto parameter", function (done) {
      mockData();
      gphoto.captureImage().then(()=> {
        expect(gphotoCliService.spawnGphoto).toHaveBeenCalledWith(["--capture-image","--filename",jasmine.any(String)]);
        done();
      });

    });
    /*it("should call spawn with gphoto parameter", function (done) {
      mockData();
      gphoto.captureMovie({duration:"10s"}).then(()=> {
        expect(gphotoCliService.spawnGphoto).toHaveBeenCalledWith(["--capture-movie=10s","--filename",jasmine.any(String)]);
        done();
      });

    });*/
    it("should call spawn with gphoto parameter for captureImageAndDownload", function (done) {
      mockData();
      gphoto.captureImageAndDownload()
        .then(()=> {
          expect(gphotoCliService.spawnGphoto).toHaveBeenCalledWith(["--capture-image-and-download","--filename",jasmine.any(String)]);
          done();
        });

    });
    it("should return the filename", function (done) {
      mockData(0,CIAD_DATA);
      gphoto.captureImageAndDownload()
        .then((imagePath)=> {
          expect(imagePath).toEqual({filename:"1460393800708.jpg"});
          done();
        });

    });
    it("should return a promise when the image has been captured", function (done) {
      mockData();
      gphoto.captureImage().then(function () {
        expect(gphotoCliService.spawnGphoto).toHaveBeenCalledWith(["--capture-image","--filename",jasmine.any(String)]);
      });
      gphoto.captureImage().then(function () {
        expect(gphotoCliService.spawnGphoto).toHaveBeenCalledWith(["--capture-image","--filename",jasmine.any(String)]);
        done();
      });
    });
    it("should spawn 3 times the child process", function (done) {
      mockData();
      gphoto.captureImage().then(function () {
        mockData(1);
        expect(gphotoCliService.spawnGphoto).toHaveBeenCalledWith(["--capture-image","--filename",jasmine.any(String)]);
      });
      gphoto.captureImage().catch(function () {
        mockData();
        expect(gphotoCliService.spawnGphoto).toHaveBeenCalledWith(["--capture-image","--filename",jasmine.any(String)]);
      });
      gphoto.captureImage().then(function () {
        expect(gphotoCliService.spawnGphoto).toHaveBeenCalledWith(["--capture-image","--filename",jasmine.any(String)]);
        expect(gphotoCliService.spawnGphoto.calls.count()).toBe(3);
        done();
      });

    });
  });
  function mockData(failCode,data) {
    if(failCode){
      gphotoCliService.spawnGphoto.and.returnValue(Promise.reject(failCode));

    }else{
      gphotoCliService.spawnGphoto.and.returnValue(Promise.resolve(data));

    }
  }
});
