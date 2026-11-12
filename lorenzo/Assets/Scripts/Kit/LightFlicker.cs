// ============================================================
//  LUCE CHE TREMOLA (LightFlicker)
//  Fa tremolare l'intensita' di una luce, come una fiamma.
//
//  DOVE SI METTE
//    Su una Light (torcia, braciere).
//
//  COSA CONFIGURARE (nell'Inspector)
//    Base Intensity: l'intensita' media.
//    Amount: quanto varia (+/-).
//    Speed: la velocita' dello sfarfallio.
//
//  COME SI COLLEGA
//    Niente da collegare: parte da solo.
//
//  ESEMPIO
//    Base Intensity = 2, Amount = 0.6, Speed = 8.
// ============================================================
using UnityEngine;

/// <summary>Fa tremolare l'intensita' di una luce (torce, bracieri). Basta aggiungerlo a una Light.</summary>
[RequireComponent(typeof(Light))]
public class LightFlicker : MonoBehaviour
{
    [Tooltip("Intensita' media della luce")] public float baseIntensity = 2f;
    [Tooltip("Quanto varia l'intensita' (+/-)")] public float amount = 0.6f;
    [Tooltip("Velocita' dello sfarfallio")] public float speed = 8f;

    Light _light;
    float _seed;

    void Awake()
    {
        _light = GetComponent<Light>();
        _seed = Random.value * 100f;
    }

    void Update()
    {
        _light.intensity = baseIntensity + (Mathf.PerlinNoise(_seed, Time.time * speed) - 0.5f) * 2f * amount;
    }
}
