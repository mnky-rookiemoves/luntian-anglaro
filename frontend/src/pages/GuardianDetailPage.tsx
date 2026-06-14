/**
 * 🛡️ LUNTIAN ANGLARO — Guardian Detail Page
 * Full lore, powers breakdown, and regional connection
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store';
import { ELEMENT_CONFIG } from '@/types/game.types';
import type { Guardian, General } from '@/types/game.types';

const POWER_DESCRIPTIONS: Record<string, Record<string, { desc: string; descFil: string; type: string }>> = {
  luntian: {
    'Vine Whip': { desc: 'Lashes enemies with thorny vines. Medium damage, chance to root.', descFil: 'Hinagupit ang mga kalaban ng matinik na baging. Katamtamang pinsala, pagkakataong ma-root.', type: 'Attack' },
    'Root Shield': { desc: 'Summons roots from the earth to form a protective barrier.', descFil: 'Tumawag ng mga ugat mula sa lupa para bumuo ng protektibong hadlang.', type: 'Defense' },
    'Growth Heal': { desc: 'Channels nature energy to restore health over time.', descFil: 'Nagpapadaloy ng enerhiya ng kalikasan para ibalik ang kalusugan sa paglipas ng panahon.', type: 'Heal' },
  },
  alon: {
    'Water Slash': { desc: 'A high-pressure water blade that cuts through armor.', descFil: 'Isang high-pressure na talim ng tubig na tumatagos sa baluti.', type: 'Attack' },
    'Tidal Wave': { desc: 'Summons a massive wave dealing AoE damage to all enemies.', descFil: 'Tumawag ng malaking alon na nagdudulot ng AoE na pinsala sa lahat ng kalaban.', type: 'AoE Attack' },
    'Purify': { desc: 'Cleanses water in the area, healing allies and removing debuffs.', descFil: 'Nilinis ang tubig sa lugar, nagpapagaling sa mga kakampi at nag-aalis ng debuffs.', type: 'Heal + Cleanse' },
  },
  bulkan: {
    'Earth Slam': { desc: 'Slams the ground with massive fists, causing earthquake damage.', descFil: 'Hinampas ang lupa ng malalaking kamao, nagdudulot ng lindol na pinsala.', type: 'Attack' },
    'Rock Wall': { desc: 'Raises a wall of stone that absorbs incoming damage.', descFil: 'Nagtaas ng pader ng bato na sumasalo ng paparating na pinsala.', type: 'Defense' },
    'Seismic Strike': { desc: 'Ultimate — channeled earthquake that devastates all enemies.', descFil: 'Ultimate — channeled na lindol na sumisira sa lahat ng kalaban.', type: 'Ultimate' },
  },
  haribon: {
    'Wind Dash': { desc: 'Dashes at extreme speed, dodging attacks and repositioning.', descFil: 'Tumakbo nang sobrang bilis, umiiwas sa atake at nagbabago ng posisyon.', type: 'Mobility' },
    'Feather Storm': { desc: 'Launches razor-sharp feathers in a wide arc.', descFil: 'Nagpalipad ng matalas na balahibo sa malawak na arko.', type: 'AoE Attack' },
    'Sky Strike': { desc: 'Dives from the sky with devastating force. High crit chance.', descFil: 'Sumisid mula sa langit na may mapaminsalang puwersa. Mataas na crit chance.', type: 'Ultimate' },
  },
  pawikan: {
    'Coral Shield': { desc: 'Encases allies in protective coral armor, reducing damage.', descFil: 'Binalot ang mga kakampi sa protektibong baluti ng korales, binabawasan ang pinsala.', type: 'Defense' },
    'Deep Current': { desc: 'Creates underwater currents that slow and damage enemies.', descFil: 'Gumawa ng mga agos sa ilalim ng tubig na nagpapabagal at nagpipinsala sa mga kalaban.', type: 'CC + Damage' },
    'Bubble Trap': { desc: 'Traps enemies in inescapable bubbles, stunning them.', descFil: 'Nikulong ang mga kalaban sa mga bula na hindi matatakasan, na-stun sila.', type: 'CC + Stun' },
  },
};

const GUARDIAN_LORE: Record<string, { en: string; fil: string }> = {
  luntian: {
    en: 'Luntian is the spirit of Philippine nature itself — born from the first seed planted by the ancient diwata. For millennia, Luntian watched over the forests, rivers, and mountains. But as pollution spread, Luntian fell into a deep slumber, weakened by the dying earth. Now, awakened by the player\'s arrival, Luntian serves as both guide and first Guardian. Though the youngest in power, Luntian\'s connection to the land is the deepest of all Guardians.',
    fil: 'Si Luntian ay ang espiritu ng kalikasan ng Pilipinas — ipinanganak mula sa unang binhing itinanim ng sinaunang diwata. Sa loob ng libu-libong taon, binantayan ni Luntian ang mga kagubatan, ilog, at kabundukan. Ngunit habang kumakalat ang polusyon, natulog nang mahimbing si Luntian, humina dahil sa namamatay na lupa. Ngayon, nagising sa pagdating ng manlalaro, si Luntian ay nagsisilbing gabay at unang Tagapag-alaga.',
  },
  alon: {
    en: 'Alon was once the proud guardian of Manila Bay — a spirit of pure, crystalline water who danced with dolphins and sang with whales. When industrial waste began poisoning the bay, Alon\'s form became murky and dark. Now trapped beneath layers of pollution, Alon waits for a Guardian brave enough to cleanse the waters and restore the ocean\'s voice.',
    fil: 'Si Alon ay dating ang mapagmahal na tagapag-alaga ng Look ng Maynila — isang espiritu ng puro at malinaw na tubig na sumasayaw kasama ang mga dolphin at kumakanta kasama ang mga balyena. Nang magsimulang lasonin ng industriyal na basura ang look, naging malabo at madilim ang anyo ni Alon. Ngayon, nakulong sa ilalim ng mga patong ng polusyon, naghihintay si Alon ng isang Tagapag-alaga na sapat ang tapang para linisin ang tubig.',
  },
  bulkan: {
    en: 'Bulkan is the ancient mountain spirit of the Cordillera — a massive stone golem with a heart of volcanic lava. For centuries, Bulkan maintained the balance between earth and fire, protecting the rice terraces and mountain communities. But illegal mining has scarred the mountains, weakening Bulkan\'s stone body. Deep within the mines, Bulkan waits, ready to unleash the mountain\'s fury against those who defile it.',
    fil: 'Si Bulkan ay ang sinaunang espiritu ng kabundukan ng Kordilyera — isang malaking golem na bato na may pusong lava ng bulkan. Sa loob ng mga siglo, pinanatili ni Bulkan ang balanse sa pagitan ng lupa at apoy. Ngunit sinira ng iligal na pagmimina ang mga bundok, na nagpahina sa katawan na bato ni Bulkan. Sa kailaliman ng mga minahan, naghihintay si Bulkan, handang ilabas ang galit ng bundok.',
  },
  haribon: {
    en: 'Haribon is the wind spirit that takes the form of the Philippine Eagle — the mightiest bird in the archipelago. Once, Haribon soared over endless canopies of green. Now, with the forests shrinking daily to chainsaws and bulldozers, Haribon\'s flight grows shorter and more desperate. The spirit carries the last breath of the forest on its wings, searching for someone who can stop the destruction.',
    fil: 'Si Haribon ay ang espiritu ng hangin na nag-aanyong Agila ng Pilipinas — ang pinakamakapangyarihang ibon sa kapuluan. Dati, lumilipad si Haribon sa walang katapusang berdeng kagubatan. Ngayon, habang lumiliit ang mga kagubatan araw-araw dahil sa mga chainsaw at bulldozer, lumililiit at nagiging desperado ang paglipad ni Haribon. Dala ng espiritu ang huling hininga ng kagubatan sa kanyang mga pakpak.',
  },
  pawikan: {
    en: 'Pawikan is the ancient marine spirit — a sea turtle that has swum the Philippine seas for over 10,000 years. Pawikan remembers when the coral was vibrant and the waters were clear. Now, navigating through plastic waste and oil slicks, Pawikan\'s shell is cracked and scarred. In the depths of Tubbataha Reef, Pawikan guards the last pristine corals, waiting for a hero who can turn the tide.',
    fil: 'Si Pawikan ay ang sinaunang espiritu ng karagatan — isang pagong-dagat na lumangoy sa mga dagat ng Pilipinas sa loob ng mahigit 10,000 taon. Naaalala ni Pawikan noong makulay ang korales at malinaw ang tubig. Ngayon, habang naglalayag sa mga basura ng plastik at langis, basag at may gasgas ang balat ni Pawikan. Sa kailaliman ng Tubbataha Reef, binabantayan ni Pawikan ang huling malinis na korales.',
  },
};

const GuardianDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { guardians, generals, regions, initialize, isInitialized, language } = useGameStore();
  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [nemesis, setNemesis] = useState<General | null>(null);

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [initialize, isInitialized]);

  useEffect(() => {
    if (guardians.length > 0 && id) {
      const g = guardians.find((g) => g.id === Number(id));
      if (g) {
        setGuardian(g);
        // Find the general in the same region
        const gen = generals.find((gen) => gen.region_name === g.region_name);
        setNemesis(gen || null);
      }
    }
  }, [guardians, generals, id]);

  if (!guardian) {
    return (
      <div className="p-6 text-center">
        <div className="text-6xl mb-4">🔮</div>
        <p className="text-[var(--luntian-text-muted)]">Guardian not found...</p>
      </div>
    );
  }

  const config = ELEMENT_CONFIG[guardian.element];
  const powers = POWER_DESCRIPTIONS[guardian.name] || {};
  const lore = GUARDIAN_LORE[guardian.name];
  const region = regions.find((r) => r.name === guardian.region_name);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/guardians')}
        className="text-sm text-[var(--luntian-text-muted)] hover:text-[var(--luntian-primary-light)] transition-colors mb-6 flex items-center gap-1"
      >
        ← {language === 'en' ? 'Back to Guardians' : 'Bumalik sa mga Tagapag-alaga'}
      </button>

      {/* Hero Card */}
      <div
        className="rounded-2xl p-8 border mb-8"
        style={{
          backgroundColor: `${config.bgColor}22`,
          borderColor: `${config.color}44`,
          boxShadow: `0 0 40px ${config.color}11`,
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div
            className="w-28 h-28 rounded-2xl flex items-center justify-center text-6xl border-2"
            style={{
              backgroundColor: `${config.bgColor}44`,
              borderColor: `${config.color}66`,
              boxShadow: `0 0 20px ${config.color}33`,
            }}
          >
            {config.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold" style={{ color: config.color }}>
              {guardian.display_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 justify-center md:justify-start">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  color: config.color,
                  backgroundColor: `${config.color}22`,
                  border: `1px solid ${config.color}44`,
                }}
              >
                {guardian.element_display}
              </span>
              <span className="text-sm text-[var(--luntian-text-muted)]">
                {guardian.combat_role_display}
              </span>
              <span className="text-sm text-[var(--luntian-text-muted)]">
                • Ch.{guardian.awakening_chapter}
              </span>
            </div>
            <p className="text-sm text-[var(--luntian-text-muted)] mt-3">
              {language === 'fil' && guardian.description_filipino
                ? guardian.description_filipino
                : guardian.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Powers */}
        <div className="rounded-2xl p-6 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20">
          <h2 className="text-lg font-semibold text-[var(--luntian-text)] mb-4">
            ⚡ {language === 'en' ? 'Powers' : 'Kapangyarihan'}
          </h2>
          <div className="space-y-4">
            {[guardian.power_1, guardian.power_2, guardian.power_3].map((power, i) => {
              const info = powers[power];
              return (
                <div
                  key={i}
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: `${config.color}08`,
                    borderColor: `${config.color}22`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm" style={{ color: config.color }}>
                      {power}
                    </h3>
                    {info && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          color: config.color,
                          backgroundColor: `${config.color}15`,
                        }}
                      >
                        {info.type}
                      </span>
                    )}
                  </div>
                  {info && (
                    <p className="text-xs text-[var(--luntian-text-muted)] mt-1">
                      {language === 'fil' ? info.descFil : info.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lore */}
        <div className="rounded-2xl p-6 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20">
          <h2 className="text-lg font-semibold text-[var(--luntian-text)] mb-4">
            📜 {language === 'en' ? 'Lore' : 'Kasaysayan'}
          </h2>
          {lore ? (
            <p className="text-sm text-[var(--luntian-text-muted)] leading-relaxed italic">
              "{language === 'fil' ? lore.fil : lore.en}"
            </p>
          ) : (
            <p className="text-sm text-[var(--luntian-text-muted)]">
              {language === 'en' ? 'Lore not yet discovered...' : 'Hindi pa natutuklasan ang kasaysayan...'}
            </p>
          )}

          {/* Region Connection */}
          {region && (
            <div className="mt-6 rounded-xl p-4 bg-[var(--luntian-primary)]/5 border border-[var(--luntian-primary)]/20">
              <h3 className="text-xs font-semibold text-[var(--luntian-text-muted)] uppercase tracking-wider mb-2">
                📍 {language === 'en' ? 'Home Region' : 'Rehiyong Tahanan'}
              </h3>
              <div className="text-sm font-bold text-[var(--luntian-primary-light)]">
                {language === 'fil' && region.name_filipino ? region.name_filipino : region.name}
              </div>
              <div className="text-xs text-[var(--luntian-text-muted)] mt-1">
                Saga {region.saga} • {language === 'en' ? 'Chapter' : 'Kabanata'} {region.chapter_number}
              </div>
            </div>
          )}

          {/* Nemesis */}
          {nemesis && (
            <div className="mt-4 rounded-xl p-4 bg-red-950/20 border border-red-900/30">
              <h3 className="text-xs font-semibold text-red-400/60 uppercase tracking-wider mb-2">
                💀 {language === 'en' ? 'Nemesis' : 'Kaaway'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-red-400">{nemesis.display_name}</span>
                <span className="text-xs text-red-300/60">{nemesis.threat_display}</span>
              </div>
              <p className="text-xs text-[var(--luntian-text-muted)] mt-1">
                {language === 'fil' && nemesis.description_filipino
                  ? nemesis.description_filipino
                  : nemesis.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Other Guardians Navigation */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-[var(--luntian-text-muted)] mb-3">
          🛡️ {language === 'en' ? 'Other Guardians' : 'Iba pang Tagapag-alaga'}
        </h3>
        <div className="flex gap-3">
          {guardians
            .filter((g) => g.id !== guardian.id)
            .map((g) => {
              const c = ELEMENT_CONFIG[g.element];
              return (
                <button
                  key={g.id}
                  onClick={() => navigate(`/guardians/${g.id}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${c.bgColor}18`,
                    borderColor: `${c.color}33`,
                  }}
                >
                  <span className="text-xl">{c.emoji}</span>
                  <span className="text-sm font-medium" style={{ color: c.color }}>
                    {g.display_name}
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default GuardianDetailPage;