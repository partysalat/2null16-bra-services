'use strict';
var rewire = require("rewire");
describe('gphoto', function () {
  var GPhoto, spawnMock;
  beforeEach(function () {
    GPhoto = rewire('../../../../src/server/bluetooth/camera/gphoto/index');
    spawnMock = jasmine.createSpy("spawn");
    GPhoto.__set__("spawn", spawnMock);
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
        expect(spawnMock).toHaveBeenCalledWith("gphoto2", ["--capture-image"]);
        done();
      });

    });
    it("should call spawn with gphoto parameter for caputePictureAndDownload", function (done) {
      mockData();
      gphoto.captureImageAndDownload()
        .then(()=> {
          expect(spawnMock).toHaveBeenCalledWith("gphoto2", ["--capture-image-and-download"]);
          done();
        });

    });
    it("should return a promise when the image has been captured", function (done) {
      mockData();
      gphoto.captureImage().then(function () {
        expect(spawnMock).toHaveBeenCalledWith("gphoto2", ["--capture-image"]);
      });
      gphoto.captureImage().then(function () {
        expect(spawnMock).toHaveBeenCalledWith("gphoto2", ["--capture-image"]);
        done();
      });
    });
    it("should spawn 3 times the child process", function (done) {
      mockData();
      gphoto.captureImage().then(function () {
        mockData(1);
        expect(spawnMock).toHaveBeenCalledWith("gphoto2", ["--capture-image"]);
      });
      gphoto.captureImage().catch(function () {
        mockData();
        expect(spawnMock).toHaveBeenCalledWith("gphoto2", ["--capture-image"]);
      });
      gphoto.captureImage().then(function () {
        expect(spawnMock).toHaveBeenCalledWith("gphoto2", ["--capture-image"]);
        expect(spawnMock.calls.count()).toBe(3);
        done();
      });

    });
  });
  function mockData(failCode) {
    spawnMock.and.callFake(function () {
      return {
        stdout:spawnMock,
        on: function (event, callback) {
          callback(failCode);
        }
      };
    });
  }
});
