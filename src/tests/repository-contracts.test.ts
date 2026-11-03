import test from 'node:test';
import assert from 'node:assert/strict';
import {
  InMemoryShelterRepository,
  InMemoryOrderRepository,
  InMemoryFamilyMemberRepository,
} from '../repositories/in-memory-repositories';
import { NoOpPayoutPolicy } from '../domain/interfaces';

test('ShelterRepository satisfies reader and writer contracts', async () => {
  const repo = new InMemoryShelterRepository();

  const all = await repo.getAll();
  assert.ok(all.length >= 8, 'Must provide at least 8 seed shelters');

  const bengaluruShelters = await repo.getByCity('Bengaluru');
  assert.ok(bengaluruShelters.length >= 2);
  assert.ok(bengaluruShelters.every(s => s.city === 'Bengaluru'));

  // Test proof addition
  const target = all[0];
  const proof = await repo.addProof(target.id, {
    shelterId: target.id,
    title: 'Contract Test Proof',
    photoUrl: 'https://example.com/proof.jpg',
    description: 'Test distribution note',
    mealCountFunded: 30,
  });

  assert.equal(proof.shelterId, target.id);
  const updated = await repo.getById(target.id);
  assert.ok(updated?.proofHistory.some(p => p.id === proof.id));
});

test('OrderRepository creates and advances order through finite timeline', async () => {
  const repo = new InMemoryOrderRepository([]);

  const created = await repo.createOrder({
    idempotencyKey: 'idemp_contract_1',
    userId: 'u_test',
    donorName: 'Contract Donor',
    donorPhone: '+91 99999 88888',
    donorEmail: 'test@donor.org',
    shelterId: 'sh_bengaluru_chhaya',
    shelterName: 'Chhaya Sanctuary',
    giftId: 'gift_feed_5_dogs',
    giftTitle: 'Feed 5 Indie Dogs',
    amountInPaise: 25000,
    quantity: 1,
    paymentMethod: 'UPI',
  });

  assert.equal(created.status, 'PAID');
  assert.ok(created.certificateId.startsWith('cert_'));

  const advanced = await repo.advanceOrderStatus(created.id, 'SHELTER_CONFIRMED', 'Confirmed by shelter');
  assert.equal(advanced.status, 'SHELTER_CONFIRMED');

  const retrieved = await repo.getOrder(created.id);
  assert.equal(retrieved?.status, 'SHELTER_CONFIRMED');
});

test('FamilyMemberRepository supports CRUD and per-date mute toggle', async () => {
  const repo = new InMemoryFamilyMemberRepository([]);

  const member = await repo.addMember('u_test', {
    name: 'Test Grandfather',
    relationship: 'Grandfather',
    specialDates: [],
  });

  assert.equal(member.name, 'Test Grandfather');

  const date = await repo.addSpecialDate('u_test', member.id, {
    title: 'Grandfather 90th Birthday',
    month: 12,
    day: 25,
    type: 'birthday',
    isMuted: false,
  });

  assert.equal(date.isMuted, false);

  const isMutedNow = await repo.toggleMute('u_test', member.id, date.id);
  assert.equal(isMutedNow, true);

  // Test Delete User Data (GDPR/DPDP)
  await repo.deleteUserData('u_test');
  const empty = await repo.getByUserId('u_test');
  assert.equal(empty.length, 0);
});

test('NoOpPayoutPolicy unconditionally allows disbursements', async () => {
  const policy = new NoOpPayoutPolicy();
  const evaluation = await policy.evaluateDisbursement('sh_1', 500000);
  assert.equal(evaluation.canDisburse, true);
});
