describe('Build', function() {
  describe('class methods', function() {
    describe('byRepositoryId', function() {
      it('requests GET /repositories.json', function() {
        Travis.Build.byRepositoryId(1);
        expect(mostRecentAjaxRequest().url).toEqual('/repositories/1/builds.json?bare=true');
      });
    });

    describe('createOrUpdate', function() {
      it('calls createOrUpdate for each of the matrix builds, too', function() {
        var build = Travis.Build.createOrUpdate({ id: 99, number: '1', matrix: [{ id: 2, number: '1.1' }]});
        build = Travis.Build.find(build.get('id'));

        expect(build.get('number')).toEqual(1);
        expect(build.getPath('matrix.firstObject.number')).toEqual(1.1);
      });
    });
  });

  describe('instance', function() {
    var repository, build;

    beforeEach(function() {
      repository = Test.Factory.Repository.travis();
      build = Test.Factory.Build.passing();
    });

    describe('associations', function() {
      it('has many tests as a matrix', function() {
        expect(build.get('matrix').objectAt(0).get('number')).toEqual(1.1); // what's a better way to test this? is there something like className in sc 2?
      });

      it('belongs to a repository', function() {
        var _repository = build.get('repository');
        whenReady(_repository, function() {
          expect(_repository.get('slug')).toEqual(repository.get('slug'));
        })
      });
    });

  // update
  //   it updates with the given attributes
  //   it does partial updates on matrix job attributes

  // updateTimes
  //   it updates properties based on duration
  //   it updates properties based on finished_at

  // isMatrix
  //   returns true if the matrix has more than one build
  //   returns false if the matrix has only one build
  //   updates bindings when the matrix length changes

    describe('properties', function() {
      describe('color', function() {
        it('returns "green" if the build has passed', function() {
          build.set('result', 0);
          expect(build.get('color')).toEqual('green');
        });

        it('returns "red" if the build has failed', function() {
          build.set('result', 1);
          expect(build.get('color')).toEqual('red');
        });

        it('returns undefined if the build result is unknown', function() {
          build.set('result', null);
          expect(build.get('color')).toEqual(undefined);
        });

        it('updates when the build result changes')
      });

      it('appendLog', function() {
        build.set('log', 'test-1');
        build.appendLog('test-2');
        expect(build.get('log')).toEqual('test-1test-2');
      });
    });
  });
});
