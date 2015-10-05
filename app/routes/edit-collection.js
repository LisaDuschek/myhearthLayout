import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      cards: this.store.findAll('card'),
      join: this.store.find('carduser', {user: this.get('session').get('user')})
    });
    return ;
  },
  actions: {
    addCard(card, user, join) {
      var found = false;
      join.forEach(function(joinItem) {
        if(joinItem.get('card').get('id') === card.id) {
          var newCardUser = joinItem;
          var newCount = newCardUser.get('count') + 1;
          newCardUser.set('count', newCount);
          found = true;
        }
      })
      if (found === false) {
        var cardUserParams = {card: card, user: user, count: 1};
        var newCardUser = this.store.createRecord('carduser', cardUserParams);
      }
      newCardUser.save().then(function() {
        card.get('card_users').addObject(newCardUser);
        user.get('card_users').addObject(newCardUser);
        card.save().then(function() {
          user.save();
        })
      })
    }
  }
});
